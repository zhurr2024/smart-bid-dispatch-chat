import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BidDetailPanel } from '@/components/bid/BidDetailPanel'
import { useUiStore } from '@/stores/uiStore'

export const AppLayout: React.FC = () => {
  const selectedBidId = useUiStore(s => s.selectedBidId)

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
        {selectedBidId && <BidDetailPanel bidId={selectedBidId} />}
      </div>
    </div>
  )
}
