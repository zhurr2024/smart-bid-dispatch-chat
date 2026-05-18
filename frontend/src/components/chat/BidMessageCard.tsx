import React from 'react'
import { Bid } from '@/types'
import { priorityBorderClass } from '../bid/PriorityBadge'
import { BidTypeBadge, TenderTypeBadge } from '../bid/BidTypeBadge'
import { MapPin, Building2, Banknote, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { AssignModal } from '../bid/AssignModal'
import { getUrgencyLabel, getDeadlineCountdown } from '@/skills/bid-analysis/priorityEngine'
import clsx from 'clsx'

interface BidMessageCardProps {
  bid: Bid
  onStatusAction?: (bid: Bid, action: string) => void
}

export const BidMessageCard: React.FC<BidMessageCardProps> = ({ bid, onStatusAction }) => {
  const user = useAuthStore(s => s.user)
  const setSelectedBidId = useUiStore(s => s.setSelectedBidId)
  const selectedBidId = useUiStore(s => s.selectedBidId)
  const [assignOpen, setAssignOpen] = React.useState(false)

  const isSelected = selectedBidId === bid.id
  const urgency = getUrgencyLabel(bid)
  const deadline = getDeadlineCountdown(bid.deadlineAt)

  const canAssign = user && ['HQ_OPS', 'SALES_ADMIN'].includes(user.role)
  const canReceive = false // RECEIVED status removed
  const canTrack = user?.role === 'AR' && user.id === bid.assignedTo && bid.status === 'ASSIGNED'

  return (
    <>
      <div
        className={clsx(
          'bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200',
          'border-l-4',
          priorityBorderClass(bid.priority),
          isSelected ? 'border-r-indigo-400 shadow-md' : 'border-slate-200 hover:shadow-md',
          'cursor-pointer'
        )}
        onClick={() => setSelectedBidId(isSelected ? null : bid.id)}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Priority badge using getUrgencyLabel */}
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-semibold',
                  urgency.colorClass,
                  urgency.bgClass
                )}
              >
                {urgency.label}
              </span>
              <BidTypeBadge bidType={bid.bidType} />
              <TenderTypeBadge tenderType={bid.tenderType} />
            </div>
            <StatusChip status={bid.status} />
          </div>

          {/* Title */}
          <div className="font-semibold text-slate-900 text-sm mb-2 leading-snug line-clamp-2">
            {bid.projectName}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1 col-span-2">
              <Building2 size={12} />
              <span className="truncate">{bid.purchaserName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate">{bid.location}</span>
            </div>
            {bid.budget && (
              <div className="flex items-center gap-1">
                <Banknote size={12} />
                <span className="font-medium text-slate-700">≈{bid.budget}万</span>
              </div>
            )}
            {bid.deadlineAt && (
              <div
                className={clsx(
                  'flex items-center gap-1',
                  (deadline.isUrgent || deadline.isOverdue) ? 'text-red-500 font-medium' : 'text-slate-500'
                )}
              >
                {(deadline.isUrgent || deadline.isOverdue) ? '⏰' : <Clock size={12} />}
                <span>{deadline.text}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(bid.publishedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{bid.summary}</p>

          {/* Actions */}
          {(canAssign || canReceive || canTrack) && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              {canAssign && bid.status === 'PENDING' && (
                <Button size="sm" onClick={() => setAssignOpen(true)}>分配</Button>
              )}
              {canAssign && bid.status === 'ASSIGNED' && (
                <Button size="sm" variant="secondary" onClick={() => setAssignOpen(true)}>重新分配</Button>
              )}

              {canTrack && (
                <Button size="sm" onClick={() => onStatusAction?.(bid, 'IN_PROGRESS')}>开始跟进</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setSelectedBidId(bid.id)}>
                查看详情
              </Button>
            </div>
          )}

          {bid.assignedToUser && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold">
                {bid.assignedToUser.name[0]}
              </div>
              <span>已分配给 <span className="text-slate-700 font-medium">{bid.assignedToUser.name}</span></span>
            </div>
          )}
        </div>
      </div>

      <AssignModal bid={bid} open={assignOpen} onClose={() => setAssignOpen(false)} />
    </>
  )
}

const statusMap: Record<string, { label: string; cls: string }> = {
  UPLOADED: { label: '已上传', cls: 'bg-amber-50 text-amber-700' },
  PENDING: { label: '待分配', cls: 'bg-slate-100 text-slate-600' },
  ASSIGNED: { label: '已分配', cls: 'bg-blue-50 text-blue-700' },
  IN_PROGRESS: { label: '跟进中', cls: 'bg-indigo-50 text-indigo-700' },
  OPPORTUNITY: { label: '已创建商机', cls: 'bg-emerald-50 text-emerald-700' },
  NO_OPPORTUNITY: { label: '无商机', cls: 'bg-slate-100 text-slate-400' },
  LINKED_OPPORTUNITY: { label: '已关联商机', cls: 'bg-purple-50 text-purple-700' },
  COMPLETED: { label: '完成', cls: 'bg-purple-50 text-purple-700' },
}

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const s = statusMap[status] || { label: status, cls: 'bg-slate-100 text-slate-600' }
  return (
    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0', s.cls)}>
      {s.label}
    </span>
  )
}
