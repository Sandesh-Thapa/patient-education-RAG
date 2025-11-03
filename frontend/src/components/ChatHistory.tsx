import { ChatMessage } from '@/types/chat';
import MarkdownPreview from '@uiw/react-markdown-preview';

const ChatHistory = ({chats}: {chats: ChatMessage[]}) => {
    return (
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
    )
}

export default ChatHistory;