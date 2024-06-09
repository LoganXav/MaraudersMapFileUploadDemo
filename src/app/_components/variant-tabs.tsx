"use client"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/common/tabs"
import { FileUploader } from "./file-uploader"
import { McqForm } from "./mcq-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/common/dropdown-menu"
import { Button } from "@/components/common/button"
import { Label } from "@/components/common/label"
import { Input } from "@/components/common/input"

export function VariantTabs() {
  const { setTheme } = useTheme()
  return (
    <Tabs defaultValue="file" className="w-fulloverflow-hidden">
      <div className="flex space-x-4">
        <TabsList>
          <TabsTrigger value="file">File</TabsTrigger>
          <TabsTrigger value="mcqs">Mcqs</TabsTrigger>
        </TabsList>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background" align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 py-4 px-1 max-w-md space-y-2">
        <Label>Company Name</Label>
        <Input placeholder="Type the brand name" />
      </div>
      <TabsContent value="file" className="mt-6">
        <FileUploader />
      </TabsContent>
      <TabsContent value="mcqs" className="mt-6">
        <McqForm />
      </TabsContent>
    </Tabs>
  )
}
