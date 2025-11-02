export type Role = "user" | "assistant"

export interface ChatMessage {
  role: Role
  message: string
  threadId?: string
  createdAt?: string
}