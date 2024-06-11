"use client"
import React from "react"
import { FileUpload } from "@/components/file-upload"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useCreateClientRecordMutation } from "@/server/react-query/client"
import { uploadToS3 } from "@/server/s3/upload"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Loader } from "lucide-react"

export function FileUploader() {
  const [isPending, startTransition] = React.useTransition()
  const [file, setFile] = React.useState<File | null>(null)
  const [companyName, setCompanyName] = React.useState<string>("")

  const { createClientRecord, isLoading, error } =
    useCreateClientRecordMutation()

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file.size > 10 * 1024 * 1024) {
      // larger than 10mb!
      toast.error("File too large. Please upload a smaller file")
      return
    }
    setFile(file)
  }, [])

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected")
      return
    }
    if (!companyName) {
      toast.error("Please type the name of the brand")
      return
    }

    try {
      startTransition(async () => {
        const data: any = await uploadToS3(file)
        console.log(data, "data")

        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong! Please try again.")
          return
        }

        const recordData = {
          ...data,
          client_name: companyName
        }

        createClientRecord(recordData, {
          onSuccess: () => {
            toast.success("A new client record has created!")
          },
          onError: (error: any) => {
            toast.error("Error creating client record.")
            console.error(error)
          }
        })
      })
    } catch (error) {
      console.error(error)
      toast.error("An error occured while uploading your brief.")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop
  })

  return (
    <div className="mt-16 space-y-8">
      <div className="px-1 max-w-md space-y-2">
        <Label>Company Name</Label>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={isPending || isLoading}
          placeholder="Type the brand name"
        />
      </div>
      <FileUpload
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isPending={isPending}
        isLoading={isLoading}
        file={file}
        onRemoveFile={handleRemoveFile}
      />
      <div className="flex">
        <div className="flex-1" />
        <Button disabled={isPending || isLoading} onClick={handleUpload}>
          Proceed{" "}
          {isPending || isLoading ? (
            <Loader className="animate-spin ml-1 w-4 h-4" />
          ) : (
            <ArrowRightIcon className="ml-1 w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
