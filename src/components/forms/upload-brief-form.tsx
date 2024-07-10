"use client"
import React from "react"
import { FileUpload } from "@/components/common/file-upload"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useCreateClientRecordMutation } from "@/server/react-query"
import { uploadToS3 } from "@/server/s3/upload"
import { useDropzone } from "react-dropzone"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CLIENT_NAME,
  CLIENT_RECORD,
  FILE_MISSING_ERROR,
  FILE_TOO_LARGE_ERROR,
  SOMETHING_WENT_WRONG,
  resourceCreationError,
  resourceCreationSuccess,
  resourceMissingError
} from "@/lib/system-messages"
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils"

export function UploadBriefForm() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [file, setFile] = React.useState<File | null>(null)
  const [companyName, setCompanyName] = React.useState<string>("")

  const { createClientRecord, isLoading, error } =
    useCreateClientRecordMutation()

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file.size > 10 * 1024 * 1024) {
      // larger than 10mb!
      toastErrorMessage(FILE_TOO_LARGE_ERROR)
      return
    }
    setFile(file)
  }, [])

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toastErrorMessage(FILE_MISSING_ERROR)
      return
    }
    if (!companyName) {
      toastErrorMessage(resourceMissingError(CLIENT_NAME))
      return
    }

    try {
      startTransition(async () => {
        const data: any = await uploadToS3(file)

        if (!data?.file_key || !data.file_name) {
          toastErrorMessage(SOMETHING_WENT_WRONG)
          return
        }

        const recordData = {
          ...data,
          client_name: companyName
        }

        console.log(recordData, "recordData")

        createClientRecord(recordData, {
          onSuccess: ({ client_id }) => {
            toastSuccessMessage(resourceCreationSuccess(CLIENT_RECORD))

            router.push(`/client/${client_id}`)
          },
          onError: (error) => {
            toastErrorMessage(resourceCreationError(CLIENT_RECORD))
            console.error(error)
          }
        })
      })
    } catch (error) {
      console.error(error)
      toastErrorMessage(SOMETHING_WENT_WRONG)
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
