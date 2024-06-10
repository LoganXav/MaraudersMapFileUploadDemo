"use client"

import { cn } from "@/lib/utils"
import React from "react"

export function FileUpload(props: any) {
  const { getRootProps, getInputProps, isDragActive, isPending, isLoading } =
    props

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
