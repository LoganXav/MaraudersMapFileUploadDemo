import { FileUpload } from "@/components/file-upload"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"

export function FileUploader() {
  return (
    <div className="mt-16 space-y-8">
      <div className="px-1 max-w-md space-y-2">
        <Label>Company Name</Label>
        <Input placeholder="Type the brand name" />
      </div>
      <FileUpload />
      <div className="flex">
        <div className="flex-1" />
        <Button>
          Proceed <ArrowRightIcon className="ml-1" />
        </Button>
      </div>
      <div>Uploaded files preview here</div>
    </div>
  )
}
