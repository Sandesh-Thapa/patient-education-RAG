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
import ChatForm from "./ChatForm"
import Navbar from "./Navbar";

const NewChat = () => {
    const [input, setInput] = useState("")
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

    const sendMessage = (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault()
        console.log("Message Sent", input)
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto flex w-full flex-col justify-center px-2 pb-2 transition-all duration-700 max-w-3xl flex-1 h-fit mt-16">
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
            </div>
        </>
    )
}

export default NewChat