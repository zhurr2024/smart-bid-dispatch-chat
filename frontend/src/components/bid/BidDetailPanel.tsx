import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useBid, useBidTracks, useUpdateBidStatus, useMarkBidRead } from '@/hooks/useBids'
import { useOpportunities } from '@/hooks/useOpportunities'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { PriorityBadge } from './PriorityBadge'
import { BidTypeBadge, TenderTypeBadge } from './BidTypeBadge'
import { TrackTimeline } from '@/components/opportunity/TrackTimeline'
import { OpportunityForm } from '@/components/opportunity/OpportunityForm'
import { Button } from '@/components/ui/Button'
import { DispatchModal } from './DispatchModal'
import { Spinner } from '@/components/ui/Spinner'
import { BidStatus } from '@/types'
import clsx from 'clsx'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待分配',
  ASSIGNED: '已分配',
  RECEIVED: '已接收',
  IN_PROGRESS: '跟进中',
  OPPORTUNITY: '有商机',
  NO_OPPORTUNITY: '无商机',
  COMPLETED: '完成',
}

interface BidDetailPanelProps { bidId: string }

export const BidDetailPanel: React.FC<BidDetailPanelProps> = ({ bidId }) => {
  const close = useUiStore(s => s.setSelectedBidId)
  const user = useAuthStore(s => s.user)
  const { data: bid, isLoading } = useBid(bidId)
  const { data: tracks = [] } = useBidTracks(bidId)
  const { data: opps = [] } = useOpportunities({ bidId })
  const updateStatus = useUpdateBidStatus()
  const markRead = useMarkBidRead()
  const [assignOpen, setAssignOpen] = useState(false)
  const [showOppForm, setShowOppForm] = useState(false)

  // Auto-mark SSG bids as read when viewed
  useEffect(() => {
    if (bid && bid.bidType === 'SSG' && !bid.isRead) {
      markRead.mutate(bid.id)
    }
  }, [bid?.id, bid?.isRead])

  const isISG = bid?.bidType === 'ISG'
  const isSSG = bid?.bidType === 'SSG'
  const canAssign = user?.role === 'SALES_ADMIN' && bid?.status === 'PENDING' && isISG
  const isMyBid = user?.role === 'AR' && user.id === bid?.assignedTo
  const canReceive = isMyBid && bid?.status === 'ASSIGNED'
  const canProgress = isMyBid && bid?.status === 'RECEIVED'
  const canFeedback = isMyBid && bid?.status === 'IN_PROGRESS'

  const doStatus = async (status: BidStatus, note?: string) => {
    if (!bid) return
    await updateStatus.mutateAsync({ id: bid.id, status, note })
  }

  if (isLoading) {
    return (
      <aside className="w-90 border-l border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
        <Spinner />
      </aside>
    )
  }
  if (!bid) return null

  return (
    <>
      <aside className="w-[360px] border-l border-slate-200 bg-white flex flex-col flex-shrink-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={bid.priority} />
            <BidTypeBadge bidType={bid.bidType} />
            <TenderTypeBadge tenderType={bid.tenderType} />
          </div>
          <button onClick={() => close(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Project info */}
          <div className="px-4 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-sm leading-snug mb-3">{bid.projectName}</h2>
            <div className="space-y-2 text-xs text-slate-600">
              <DetailRow label="采购单位" value={bid.purchaserName} />
              <DetailRow label="项目地点" value={bid.location} />
              <DetailRow label="战区" value={bid.region} />
              {bid.budget && <DetailRow label="预算金额" value={`约 ${bid.budget} 万元`} highlight />}
              <DetailRow label="发布时间" value={new Date(bid.publishedAt).toLocaleDateString('zh-CN')} />
              {bid.deadlineAt && (
                <DetailRow
                  label="截止时间"
                  value={new Date(bid.deadlineAt).toLocaleDateString('zh-CN')}
                  highlight={new Date(bid.deadlineAt).getTime() - Date.now() < 7 * 86400000}
                />
              )}
              <DetailRow label="标讯编号" value={bid.bidNo} />
              <DetailRow label="当前状态" value={STATUS_LABELS[bid.status] || bid.status} />
              {bid.assignedToUser && <DetailRow label="负责人" value={bid.assignedToUser.name} />}
              {isSSG && <DetailRow label="已读状态" value={bid.isRead ? '已读' : '未读'} />}
            </div>
          </div>

          {/* Summary */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1.5">项目概述</div>
            <p className="text-sm text-slate-700 leading-relaxed">{bid.summary}</p>
            {bid.keywords && bid.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bid.keywords.map(k => (
                  <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{k}</span>
                ))}
              </div>
            )}
          </div>

          {/* Actions - only for ISG bids (SSG cannot be dispatched) */}
          {isISG && (
            <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap gap-2">
              {canAssign && (
                <Button size="sm" onClick={() => setAssignOpen(true)}>分配标讯</Button>
              )}
              {canReceive && (
                <Button size="sm" onClick={() => doStatus('RECEIVED')}>接收标讯</Button>
              )}
              {canProgress && (
                <Button size="sm" onClick={() => doStatus('IN_PROGRESS')}>开始跟进</Button>
              )}
              {canFeedback && (
                <>
                  <Button size="sm" className="!bg-emerald-600 hover:!bg-emerald-700" onClick={() => doStatus('OPPORTUNITY', '有商机')}>有商机</Button>
                  <Button size="sm" variant="secondary" className="!text-slate-600" onClick={() => doStatus('NO_OPPORTUNITY', '无商机')}>无商机</Button>
                </>
              )}
              {isMyBid && bid.status === 'OPPORTUNITY' && (
                <Button size="sm" variant="secondary" onClick={() => setShowOppForm(f => !f)}>
                  {showOppForm ? '收起' : '商机详情'}
                </Button>
              )}
            </div>
          )}

          {/* Opportunity Form - ISG only */}
          {showOppForm && isISG && (
            <div className="px-4 py-3 border-b border-slate-100">
              <OpportunityForm bid={bid} existing={opps[0]} onSuccess={() => setShowOppForm(false)} />
            </div>
          )}

          {/* Track Timeline */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-slate-700 mb-3">跟进记录</div>
            <TrackTimeline tracks={tracks} />
          </div>
        </div>
      </aside>

      {canAssign && <DispatchModal bid={bid} open={assignOpen} onClose={() => setAssignOpen(false)} />}
    </>
  )
}

const DetailRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex items-start gap-2">
    <span className="text-slate-400 w-16 flex-shrink-0">{label}</span>
    <span className={clsx('flex-1', highlight ? 'text-indigo-700 font-medium' : 'text-slate-700')}>{value}</span>
  </div>
)
