"use client"
import { Button } from "@/components/common/button"
import { Textarea } from "@/components/common/textarea"
import React, { useState } from "react"
import { useChat } from "ai/react"
import { Message } from "ai"
import { useQuery } from "react-query"
import axios from "axios"
import { cn } from "@/lib/utils"
import { useAssignStaffMutation } from "@/server/react-query/client"
import { Loader } from "lucide-react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

type Props = { clientId: string | number }

const ChatComponent = ({ clientId }: Props) => {
  const pathname = usePathname()

  const id = clientId || Number(pathname?.split("/")[2])

  const [assignedStaff, setAssignedStaff] = useState<string[]>([])
  const { assignStaff, isLoading, error } = useAssignStaffMutation(
    (data: any) => {
      toast.success("Staff members assigned!")
      setAssignedStaff(parseNames(data.result))
    }
  )

  const parseNames = (namesString: string) => {
    return namesString.split(",").map((name) => name.trim())
  }

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/client/chat",
    body: {
      clientId
    },
    initialMessages: []
  })

  const handleAssignStaff = async () => {
    assignStaff({ clientId: id })
  }

  return (
    <div className="h-full grid lg:grid-cols-3">
      <div className="relative lg:min-h-screen min-h-96 w-full p-8 lg:col-span-2 border">
        <div className="flex flex-col gap-2 py-16">
          {messages.map((message: any) => {
            return (
              <div
                key={message.id}
                className={cn("flex", {
                  "justify-end pl-10": message.role === "user",
                  "justify-start pr-10": message.role === "assistant"
                })}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                    {
                      "bg-blue-600 text-white": message.role === "user"
                    }
                  )}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            )
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="absolute bottom-10 left-0 p-8 w-full"
        >
          <div className="space-y-2 rounded-sm">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="text-lg min-h-12"
            />
            <Button className="w-full">Send</Button>
          </div>
        </form>
      </div>
      <div className="p-8 lg:border-l border-input">
        <Button disabled={isLoading} onClick={handleAssignStaff}>
          Assign Members{" "}
          {isLoading ? (
            <Loader className="animate-spin ml-1 w-4 h-4" />
          ) : (
            <ArrowRightIcon className="ml-1 w-4 h-4" />
          )}
        </Button>

        <h3 className="py-4 font-2xl font-roobert font-bold">
          Assigned Staff:
        </h3>

        {assignedStaff?.map((staff, idx) => (
          <div key={idx}>
            <div className="text-wrap">{staff}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatComponent
