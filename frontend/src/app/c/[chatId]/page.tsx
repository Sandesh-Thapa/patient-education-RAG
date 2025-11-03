"use client"

import { useState, FormEvent, useEffect } from "react"
import ChatForm from "@/components/ChatForm";
import ChatHistory from "@/components/ChatHistory";
import { ChatMessage } from "@/types/chat";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams()
    const threadId = params.chatId
    const [input, setInput] = useState("")
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

    useEffect(() => {
        fetch(`http://localhost:8000/chat/${threadId}`)
        .then(res => res.json())
        .then(data => setChatHistory(data.chat_history))
    }, [])

    const sendMessage = async (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault()
        if (!input.trim()) return

        setChatHistory((prev) => [
            ...prev,
            { role: "user", message: input },
            { role: "assistant", message: "" },
        ])
        setInput("")

        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: input, thread_id: threadId }),
        })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let botMessage = ""

        if (!reader) return

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n\n").filter(Boolean)

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const dataStr = line.replace("data: ", "")
                    if (dataStr === "[DONE]") continue
                    try {
                        const json = JSON.parse(dataStr)
                        botMessage += json.message
                        setChatHistory((prev) => {
                            const updated = [...prev]
                            updated[updated.length - 1] = {
                            role: "assistant",
                            message: botMessage,
                            }
                            return updated
                        })
                    } catch (err) {
                        console.error("Error parsing chunk", err)
                    }
                }
            }
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <ChatHistory chats={chatHistory} />
            <div
                className='
                fixed bottom-1 mx-auto p-3
                w-full md:w-[80%] xl:w-[60%] 2xl:w-[960px]
                rounded-4xl border border-gray-200 shadow bg-white
                '
            >
                <ChatForm
                    input={input}
                    onChange={(value: string) => setInput(value)}
                    onSubmit={(e) => sendMessage(e)}
                />
            </div>
        </div>
    )
}

export default Page