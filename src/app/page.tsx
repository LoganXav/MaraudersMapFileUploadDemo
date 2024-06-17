import { Shell } from "@/components/layouts/shell"
import { ThemeToggle } from "@/components/common/theme-toggle"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/common/tabs"
import { UploadBriefForm } from "@/components/forms/upload-brief-form"
import { McqForm } from "@/components/forms/mcq-form"

export default function Home() {
  return (
    <Shell className="container">
      <Tabs defaultValue="file" className="w-fulloverflow-hidden">
        <div className="flex space-x-4">
          <TabsList>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          </TabsList>
          <ThemeToggle />
        </div>

        <TabsContent value="file" className="mt-6">
          <UploadBriefForm />
        </TabsContent>
        <TabsContent value="mcqs" className="mt-6">
          <McqForm />
        </TabsContent>
      </Tabs>
    </Shell>
  )
}
