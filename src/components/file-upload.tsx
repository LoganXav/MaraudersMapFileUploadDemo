"use client"

import { cn, convertPdfToImage } from "@/lib/utils"
import React from "react"
import Dropzone, { FileRejection, useDropzone } from "react-dropzone"
import { toast } from "sonner"

export function FileUpload(props: any) {
  const { isLoading, isPending, files, setFiles } = props

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (acceptedFiles.length > 1) {
      toast.error("Cannot upload more than 1 file at a time")
    }

    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
        // url: await convertPdfToImage(file)
      })
    )

    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file }) => {
        toast.error(`File ${file.name} was rejected`)
      })
    }
    const updatedFiles = files ? [...files, ...newFiles] : newFiles

    setFiles(updatedFiles)
  }

  return (
    <Dropzone
      onDrop={onDrop}
      accept={{ "application/pdf": [".pdf"] }}
      maxSize={1024 * 1024 * 2}
      maxFiles={1}
      disabled={isPending || isLoading}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
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
      )}
    </Dropzone>
  )
}
