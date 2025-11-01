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

const NewChat = () => {
    const [input, setInput] = useState("")
    const healthPrompts = [
        {
            title: "Generate Health Guidelines",
            description: "Create personalized tips for better wellness",
            color: "emerald",
            icon: <HeartPulse />,
            value: "Generate health guidelines for maintaining daily wellness.",
        },
        {
            title: "Plan a Healthy Routine",
            description: "Design a daily fitness or nutrition schedule",
            color: "sky",
            icon: <CalendarCheck />,
            value: "Plan a healthy daily routine for balanced fitness and diet.",
        },
        {
            title: "Track Health Progress",
            description: "Monitor exercise, weight, and sleep trends",
            color: "purple",
            icon: <BarChart3 />,
            value: "Track my health progress including exercise, weight, and sleep.",
        },
        {
            title: "Get Meal Suggestions",
            description: "Find healthy recipes and nutrition plans",
            color: "orange",
            icon: <Apple />,
            value: "Suggest healthy meal plans and nutrition options.",
        },
        {
            title: "Check Symptoms",
            description: "Get guidance based on your health symptoms",
            color: "rose",
            icon: <Thermometer />,
            value: "Check symptoms and get possible health insights.",
        },
        {
            title: "Learn About Wellness",
            description: "Explore articles on mental and physical health",
            color: "indigo",
            icon: <BookOpen />,
            value: "Learn about wellness topics and mental health tips.",
        },
    ]

    const sendMessage = (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault()
        console.log("Message Sent", input)
    }

    return (
        <div className="mx-auto flex w-full flex-col justify-center px-2 pb-2 transition-all duration-700 max-w-3xl flex-1 h-fit mt-16">
            <div className="flex flex-col items-center justify-center pb-4 text-center">
                <h1 className="mb-6 text-3xl font-bold">What can I help with?</h1>
                <div className="grid w-full auto-rows-min gap-4 md:grid-cols-3">
                    {healthPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(prompt.value)}
                            className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors 
                                bg-${prompt.color}-500/10 hover:bg-${prompt.color}-500/15 
                                border-${prompt.color}-500/10 text-${prompt.color}-800 dark:text-${prompt.color}-200`
                            }
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
                    onChange={(value:string) => setInput(value)}
                    onSubmit={(e) => sendMessage(e)}
                />
            </div>
        </div>
    )
}

export default NewChat