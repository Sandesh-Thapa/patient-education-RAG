"use client"

import { useState, FormEvent } from "react"
import ChatForm from "@/components/ChatForm";

const Page = () => {
    const [input, setInput] = useState("")

    const sendMessage = (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault()
        console.log("Message Sent", input)
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
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