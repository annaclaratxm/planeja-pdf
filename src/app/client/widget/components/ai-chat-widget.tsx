"use client"

import { useState } from "react"
import { ChatButton } from "./chat-button"
import { ChatWindow } from "./chat-window"

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
