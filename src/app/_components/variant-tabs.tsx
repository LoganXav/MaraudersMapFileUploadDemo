import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/common/tabs"
import { FileUploader } from "./file-uploader"
import { McqForm } from "./mcq-form"

export function VariantTabs() {
  return (
    <Tabs defaultValue="file" className="w-full overflow-hidden">
      <TabsList>
        <TabsTrigger value="file">File</TabsTrigger>
        <TabsTrigger value="mcqs">Mcqs</TabsTrigger>
      </TabsList>
      <TabsContent value="file" className="mt-6">
        <FileUploader />
      </TabsContent>
      <TabsContent value="mcqs" className="mt-6">
        <McqForm />
      </TabsContent>
    </Tabs>
  )
}
