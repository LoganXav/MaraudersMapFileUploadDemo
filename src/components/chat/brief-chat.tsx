"use client";
import { Button } from "@/components/common/button";
import { Textarea } from "@/components/common/textarea";
import React, { useState } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import { cn, parseNamesFromString } from "@/lib/utils";
import { useAssignStaffMutation } from "@/server/react-query";
import { Loader } from "lucide-react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

type PageProps = { clientId: string | number };

const BriefChat = ({ clientId }: PageProps) => {
  const pathname = usePathname();

  const id = clientId || Number(pathname?.split("/")[2]);

  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const { assignStaff, isLoading, error } = useAssignStaffMutation((data) => {
    toast.success("Staff members assigned!");
    setAssignedStaff(parseNamesFromString(data.result));
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/client/chat",
    body: {
      clientId,
    },
    initialMessages: [],
  });

  const handleAssignStaff = async () => {
    assignStaff({ clientId: id });
  };

  return (
    <div className="h-full grid lg:grid-cols-3">
      <div className="relative overflow-y-scroll lg:h-screen h-96 w-full p-8 lg:col-span-2 border-r border-l">
        <div className="flex h-full flex-col gap-4 pt-8">
          {messages.map((message: Message) => {
            return (
              <div
                key={message.id}
                className={cn("flex", {
                  "justify-end pl-10": message.role === "user",
                  "justify-start pr-10": message.role === "assistant",
                })}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 text-sm py-1 border shadow-md ring-1 ring-gray-900",
                    {
                      "bg-foreground text-background": message.role === "user",
                    },
                  )}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-8 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-2 rounded-sm">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="min-h-32"
            />
            <Button className="w-full">Send</Button>
          </div>
        </form>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleAssignStaff}
        >
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
  );
};

export default BriefChat;
