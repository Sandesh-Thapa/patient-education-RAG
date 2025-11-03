"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MessageSquarePlus, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const [chatHistory, setChatHistory] = useState<{thread_id: string, title: string}[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/chats")
      .then(res => res.json())
      .then(data => setChatHistory(data.chats))
      .catch(err => console.log(err))
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="flex-row justify-between items-center h-16">
        <div className="flex gap-2">
          <div className="flex items-center rounded-sm bg-red-700 dark:bg-red-900 transition-colors">
            <Logo className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold">Medical Chatbot</h3>
            <span className="text-[12px] text-gray-600">Health assistant</span>
          </div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-1 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 glass-4 hover:glass-5 shadow-md h-9 px-4 py-2 w-full"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New chat
          </Link>
        </SidebarGroup>

        <SidebarGroup className="px-2">
          <Accordion type="single" collapsible defaultValue="history">
            <AccordionItem value="history" className="border-none">
              <AccordionTrigger className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:no-underline">
                Chat history
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-1 space-y-1 overflow-y-auto pr-1">
                  {chatHistory.length > 0 ? (
                    chatHistory.map((chat) => (
                      <Link
                        key={chat.thread_id}
                        href={`/c/${chat.thread_id}`}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic mt-2 px-2">
                      No chats yet
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="text-[12px] text-center font-normal text-gray-600">
          Medical assistant provides answers using WHO guidelines
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
