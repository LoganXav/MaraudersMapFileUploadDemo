"use client"
import { useCreateClientRecordMutation } from "@/lib/react-query/client"
import { uploadToS3 } from "@/lib/s3/client"
import { cn } from "@/lib/utils"
import React from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

export function FileUpload() {
  const [isPending, startTransition] = React.useTransition()

  const { createClientRecord, isLoading, error } =
    useCreateClientRecordMutation()

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
          // TODO - Implement upload file content to AWS S3
          const data: any = await uploadToS3(file)

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
  })
  return (
    <div className="">
      <div
        {...getRootProps()}
        className={cn(
          "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragActive && "border-muted-foreground/50"
        )}
      >
        <input {...getInputProps()} />
        {isPending || isLoading ? "Loading..." : "Upload"}
      </div>
    </div>
  )
}
