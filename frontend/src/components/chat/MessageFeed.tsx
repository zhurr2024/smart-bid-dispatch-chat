import React, { useMemo, useRef, useEffect } from 'react'
import { Bid, UserRole } from '@/types'
import { BidMessageCard } from './BidMessageCard'
import { useAuthStore } from '@/stores/authStore'

interface MessageFeedProps {
  bids: Bid[]
  loading: boolean
  onStatusAction: (bid: Bid, action: string) => void
  hasSearch?: boolean
  onChipSelect?: (chip: string) => void
}

const ROLE_DESC: Record<UserRole, string> = {
  HQ_OPS: '您可以上传标讯、查看全量数据、管理分配',
  SALES_ADMIN: '您可以手工分配标讯、查看跟进状态',
  AR: '查看分配给您的标讯，及时反馈跟进',
  REGION_LEADER: '查看本区域标讯全貌',
  TEAM_LEADER: '查看本区域标讯全貌',
}

const WELCOME_CHIPS = ['🔴 高优标讯', '📋 待分配', '📅 今日新增', '⏰ 即将截止']

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="h-5 w-12 bg-slate-200 rounded-full ml-4" />
      </div>
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  )
}

export const MessageFeed: React.FC<MessageFeedProps> = ({
  bids,
  loading,
  onStatusAction,
  hasSearch = false,
  onChipSelect,
}) => {
  const user = useAuthStore(s => s.user)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bids.length])

  const items = useMemo(() => {
    return bids.map(bid => ({ bid, key: `bid-${bid.id}` }))
  }, [bids])

  // Skeleton loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  // Empty with active search
  if (!bids.length && hasSearch) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 px-4">
        <div className="text-4xl">🔍</div>
        <div className="text-sm font-medium text-slate-500">未找到匹配的标讯</div>
        <button
          onClick={() => onChipSelect?.('')}
          className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          清除筛选
        </button>
      </div>
    )
  }

  // Welcome banner — no bids, no active search
  if (!bids.length && !hasSearch) {
    const roleDesc = user?.role ? ROLE_DESC[user.role] : ''
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center space-y-4">
          <div className="text-4xl">👋</div>
          <div>
            <p className="font-semibold text-slate-800 text-base">
              您好，{user?.name ?? '用户'}
            </p>
            {roleDesc && (
              <p className="text-xs text-slate-500 mt-1">{roleDesc}</p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {WELCOME_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => onChipSelect?.(chip)}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <div className="flex justify-center mb-2">
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          共 {bids.length} 条标讯
        </span>
      </div>
      {items.map(item =>
        <BidMessageCard key={item.key} bid={item.bid} onStatusAction={onStatusAction} />
      )}
      <div ref={bottomRef} />
    </div>
  )
}
