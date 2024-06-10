"use client"
import { Cross1Icon, ImageIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Card, CardDescription, CardTitle } from "@/components/common/card"
import React from "react"
import { Button } from "./common/button"

export function FileUpload(props: any) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isPending,
    isLoading,
    file,
    onRemoveFile
  } = props

  return (
    <div className="">
      {file ? (
        <Card className="relative p-4 border-input">
          <Button
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            size="icon"
            onClick={onRemoveFile}
          >
            <Cross1Icon aria-hidden="true" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <ImageIcon
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <CardTitle>{file.name}</CardTitle>
              <CardDescription>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </CardDescription>
            </div>
          </div>
        </Card>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "group relative grid h-full w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-input px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50"
          )}
        >
          <input {...getInputProps()} />
          <Card
            className={cn(
              "flex w-full flex-col items-center justify-center space-y-6 bg-transparent p-16 border-none"
            )}
            {...props}
          >
            <div className="shrink-0 rounded-full border border-dashed p-4">
              <ImageIcon
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <CardTitle>Upload Brief</CardTitle>
              <CardDescription>
                Drag {`' n '`} drop to upload a file
              </CardDescription>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
