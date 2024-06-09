import { FileUpload } from "@/components/file-upload"

export function FileUploader() {
  return (
    <div className="space-y-4">
      <FileUpload />
      <div>Uploaded files preview here</div>
    </div>
  )
}
