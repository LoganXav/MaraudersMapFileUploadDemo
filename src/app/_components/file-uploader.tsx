"use client"
import React from "react"
import { FileUpload } from "@/components/file-upload"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useCreateClientRecordMutation } from "@/server/react-query/client"
// import { uploadToS3 } from "@/server/s3/client"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"

export function FileUploader() {
  const [isPending, startTransition] = React.useTransition()

  const { createClientRecord, isLoading, error } =
    useCreateClientRecordMutation()

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!")
    },
    onUploadError: () => {
      alert("error occurred while uploading")
    },
    onUploadBegin: () => {
      alert("upload has begun")
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        // larger than 10mb!
        toast.error("File too large.")
        return
      }

      try {
        startTransition(async () => {
          // TODO - Implement upload file content to  AWS S3
          // const data: any = await uploadToS3(file)
          // TODO - Implement upload file content to  Upload thing
          const data: any = await startUpload(file as any)

          console.log(data, "dataaaaaaaaa")

          if (!data?.file_key || !data.file_name) {
            toast.error("Something went wrong! Please try again.")
            return
          }

          createClientRecord(data, {
            onSuccess: () => {
              toast.success("Client Record Created!")
            },
            onError: (error: any) => {
              toast.error("Error Creating Client Record.")
              console.error(error)
            }
          })
        })
      } catch (error) {
        console.log(error)
      }
      toast.error("Error Uploading your file.")
    }
  })

  return (
    <div className="mt-16 space-y-8">
      <div className="px-1 max-w-md space-y-2">
        <Label>Company Name</Label>
        <Input
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
      />
      <div className="flex">
        <div className="flex-1" />
        <Button disabled={isPending || isLoading}>
          Proceed{" "}
          {isPending || isLoading ? (
            <Loader className="animate-spin ml-1 w-4 h-4" />
          ) : (
            <ArrowRightIcon className="ml-1  w-4 h-4" />
          )}
        </Button>
      </div>
      <div>Uploaded files preview here</div>
    </div>
  )
}
