import React from 'react'
import { ChatPanel } from '@/components/chat/ChatPanel'

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <ChatPanel />
    </div>
  )
}
