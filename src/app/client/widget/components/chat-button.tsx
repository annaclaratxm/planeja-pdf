"use client"

import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-14 w-14 rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 transition-all"
      aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
    >
      {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
    </Button>
  )
}
