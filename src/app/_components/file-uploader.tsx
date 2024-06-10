"use client"
import React from "react"
import { FileUpload } from "@/components/file-upload"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useCreateClientRecordMutation } from "@/server/react-query/client"
// import { uploadToS3 } from "@/server/s3/client"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useUploadFile } from "@/hooks/use-upload-file"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UploadedFilesCard } from "./uploaded-files-card"

// const schema = z.object({
//   images: z.array(z.instanceof(File))
// })

// type Schema = z.infer<typeof schema>

export function FileUploader() {
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState([])

  const { createClientRecord, isLoading, error } =
    useCreateClientRecordMutation()

  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "pdfUploader",
    { defaultUploadedFiles: [] }
  )

  // const form = useForm<Schema>({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     images: []
  //   }
  // })

  function handleSubmit(input: any) {
    try {
      startTransition(async () => {
        // TODO - Implement upload file content to  AWS S3
        // const data: any = await uploadToS3(file)
        // TODO - Implement upload file content to  Upload thing
        console.log(files, "files-----------")
        const data: any = await uploadFiles(files as any)
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
  }

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
        files={files}
        setFiles={setFiles}
        isPending={isPending}
        isLoading={isLoading}
      />
      <div className="flex">
        <div className="flex-1" />
        <Button onClick={handleSubmit} disabled={isPending || isLoading}>
          Proceed{" "}
          {isPending || isLoading ? (
            <Loader className="animate-spin ml-1 w-4 h-4" />
          ) : (
            <ArrowRightIcon className="ml-1  w-4 h-4" />
          )}
        </Button>
      </div>
      {/* <UploadedFilesCard uploadedFiles={files} /> */}
      <div>Uploaded files preview here</div>
    </div>
  )
}
