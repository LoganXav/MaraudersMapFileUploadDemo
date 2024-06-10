import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers
} from "@uploadthing/react"
import { OurFileRouter } from "../server/uploadthing"

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
