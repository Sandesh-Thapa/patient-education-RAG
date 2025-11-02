"use client"

import { useState, FormEvent } from "react"
import {
    HeartPulse,
    CalendarCheck,
    BarChart3,
    Apple,
    Thermometer,
    BookOpen,
} from "lucide-react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import ChatForm from "./ChatForm"
import Navbar from "./Navbar";
import { ChatMessage } from "@/types/chat";

const NewChat = () => {
    const [input, setInput] = useState("")
    const [chats, setChats] = useState<ChatMessage[]>([])
    const healthPrompts = [
        {
            title: "Generate Health Guidelines",
            description: "Create personalized tips for better wellness",
            icon: <HeartPulse />,
            colorClass:
                "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/10 text-emerald-800 dark:text-emerald-200",
            value: "Generate health guidelines for maintaining daily wellness.",
        },
        {
            title: "Plan a Healthy Routine",
            description: "Design a daily fitness or nutrition schedule",
            icon: <CalendarCheck />,
            colorClass:
                "bg-sky-500/10 hover:bg-sky-500/15 border-sky-500/10 text-sky-800 dark:text-sky-200",
            value: "Plan a healthy daily routine for balanced fitness and diet.",
        },
        {
            title: "Track Health Progress",
            description: "Monitor exercise, weight, and sleep trends",
            icon: <BarChart3 />,
            colorClass:
                "bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/10 text-purple-800 dark:text-purple-200",
            value: "Track my health progress including exercise, weight, and sleep.",
        },
        {
            title: "Get Meal Suggestions",
            description: "Find healthy recipes and nutrition plans",
            icon: <Apple />,
            colorClass:
                "bg-orange-500/10 hover:bg-orange-500/15 border-orange-500/10 text-orange-800 dark:text-orange-200",
            value: "Suggest healthy meal plans and nutrition options.",
        },
        {
            title: "Check Symptoms",
            description: "Get guidance based on your health symptoms",
            icon: <Thermometer />,
            colorClass:
                "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/10 text-rose-800 dark:text-rose-200",
            value: "Check symptoms and get possible health insights.",
        },
        {
            title: "Learn About Wellness",
            description: "Explore articles on mental and physical health",
            icon: <BookOpen />,
            colorClass:
                "bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-500/10 text-indigo-800 dark:text-indigo-200",
            value: "Learn about wellness topics and mental health tips.",
        },
    ];

    const sendMessage = async (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault()
        if (!input.trim()) return

        const threadId = "threadId1234"
        setChats((prev) => [
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
                        setChats((prev) => {
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
        <>
            <Navbar />
            <div className="mx-auto flex w-full flex-col justify-center px-2 pb-2 transition-all duration-700 max-w-3xl flex-1 h-fit mt-16">
                {chats.length < 1 ?
                <>
                    <div className="flex flex-col items-center justify-center pb-4 text-center">
                        <h1 className="mb-6 text-3xl font-bold">What can I help with?</h1>
                        <div className="grid w-full auto-rows-min gap-4 md:grid-cols-3">
                            {healthPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(prompt.value)}
                                    className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${prompt.colorClass}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {prompt.icon}
                                        <h3 className="font-semibold">{prompt.title}</h3>
                                    </div>
                                    <p className="text-sm opacity-50">{prompt.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='rounded-4xl border border-gray-200 shadow bg-white p-3'>
                        <ChatForm
                            input={input}
                            onChange={(value: string) => setInput(value)}
                            onSubmit={(e) => sendMessage(e)}
                        />
                    </div>
                </> : 
                <>
                    <div className="mb-30">
                        {chats.map((chat, i) => (
                            <div key={i} className="my-2">
                                {chat.role === "user" ? (
                                <div className="rounded-3xl px-5 py-2.5 w-fit bg-gray-100 text-black ms-auto whitespace-pre-wrap font-mono text-sm">
                                    {chat.message}
                                </div>
                                ) : (
                                <div className="bg-transparent text-black whitespace-pre-wrap font-sans text-sm">
                                    <MarkdownPreview source={chat.message} />
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        className='
                        fixed bottom-3 mx-auto p-3
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
                </>
                }
            </div>
        </>
    )
}

export default NewChat