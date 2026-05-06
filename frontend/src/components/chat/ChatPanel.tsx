import React, { useState } from 'react'
import { MessageFeed } from './MessageFeed'
import { ChatInput } from './ChatInput'
import { AlertMessage } from './AlertMessage'
import { useBids } from '@/hooks/useBids'
import { useUpdateBidStatus } from '@/hooks/useBids'
import { Bid, BidStatus } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { Filter } from 'lucide-react'
import { parseIntent, intentToQuery } from '@/skills/chat-router'
import { runAlertChecks, AlertItem } from '@/skills/notification'

export const ChatPanel: React.FC = () => {
  const user = useAuthStore(s => s.user)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState(false)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  // Build query based on role + parsed intent
  const query = React.useMemo(() => {
    const base: Record<string, string> = {}
    if (user?.role === 'AR') base.assignedTo = user.id
    if (user?.role === 'REGION_LEADER') base.region = user.region || ''
    if (user?.role === 'TEAM_LEADER') base.region = user.region || ''

    if (search) {
      const parsed = parseIntent(search)
      const intentParams = intentToQuery(parsed)
      Object.assign(base, intentParams)
    }

    return { ...base, pageSize: '50' }
  }, [user, search])

  const { data, isLoading } = useBids(query as any)
  const updateStatus = useUpdateBidStatus()
  const bids = data?.data || []

  const alerts = React.useMemo(
    () => runAlertChecks(bids).filter((a: AlertItem) => !dismissedAlerts.has(a.id)),
    [bids, dismissedAlerts],
  )

  const handleDismiss = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id))
  }

  const handleStatusAction = async (bid: Bid, action: string) => {
    await updateStatus.mutateAsync({ id: bid.id, status: action as BidStatus })
  }

  const handleSearch = (q: string) => setSearch(q)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">标讯广场</h2>
          <p className="text-xs text-slate-500">实时标讯推送 · 快速响应</p>
        </div>
        <button
          onClick={() => setFilterActive(f => !f)}
          className="text-slate-500 hover:text-indigo-700 cursor-pointer p-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Alerts section — max 2 visible */}
      {alerts.length > 0 && (
        <div className="flex-shrink-0 px-3 pt-2 pb-1 space-y-1.5 overflow-y-auto max-h-[120px]">
          {alerts.slice(0, 2).map(alert => (
            <AlertMessage
              key={alert.id}
              alert={alert}
              onDismiss={() => handleDismiss(alert.id)}
            />
          ))}
        </div>
      )}

      <MessageFeed
        bids={bids}
        loading={isLoading}
        onStatusAction={handleStatusAction}
        hasSearch={!!search}
        onChipSelect={handleSearch}
      />
      <ChatInput onSearch={handleSearch} />
    </div>
  )
}
