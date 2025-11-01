"use client"
import { ArrowUp } from "lucide-react"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

interface ChatFormProps {
    input: string
    onChange: (value:string) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement> | undefined) => void
}

const ChatForm = ({input, onChange, onSubmit}: ChatFormProps) => {
    const [isMultilineInput, setIsMultilineInput] = useState(false)
    return (
        <form 
            className={`flex items-center ${isMultilineInput ? 'flex-col': 'flex-row'}`}
            onSubmit={onSubmit}
        >
            <TextareaAutosize
                onHeightChange={(height) => setIsMultilineInput(height > 40)}
                maxRows={8}
                className="p-2 w-full resize-none rounded focus:outline-none focus:ring-0 focus:border-gray-400"
                value={input}
                placeholder='Ask anything'
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && input.trim() !== "") {
                        e.preventDefault();
                        onSubmit(undefined)
                    }
                }}                       
            />
            <button
                className="ml-auto bg-black text-white rounded-full w-8 h-8 font-bold cursor-pointer flex justify-center items-center"
                type='submit'
                disabled={input === ""}
            >
                <ArrowUp />
            </button>
        </form>
    )
}

export default ChatForm