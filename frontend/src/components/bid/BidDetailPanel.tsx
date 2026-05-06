import React, { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useBid, useBidTracks, useUpdateBidStatus } from '@/hooks/useBids'
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
import { BID_STATUS_LABELS } from '@/skills/bid-analysis/priorityEngine'
import { BidStatus } from '@/types'
import clsx from 'clsx'

interface BidDetailPanelProps { bidId: string }

export const BidDetailPanel: React.FC<BidDetailPanelProps> = ({ bidId }) => {
  const close = useUiStore(s => s.setSelectedBidId)
  const user = useAuthStore(s => s.user)
  const { data: bid, isLoading } = useBid(bidId)
  const { data: tracks = [] } = useBidTracks(bidId)
  const { data: opps = [] } = useOpportunities({ bidId })
  const updateStatus = useUpdateBidStatus()
  const [assignOpen, setAssignOpen] = useState(false)
  const [showOppForm, setShowOppForm] = useState(false)
  const [noteInput, setNoteInput] = useState('')

  const existingOpp = opps[0]
  const isISG = bid?.bidType === 'ISG'
  const canAssign = user && ['HQ_OPS', 'SALES_ADMIN'].includes(user.role)
  const isMyBid = user?.role === 'AR' && user.id === bid?.assignedTo
  const canReceive = isMyBid && bid?.status === 'ASSIGNED'
  const canProgress = isMyBid && bid?.status === 'RECEIVED'
  const canReport = isMyBid && isISG && ['IN_PROGRESS', 'OPPORTUNITY'].includes(bid?.status || '')
  const canClose = isMyBid && ['OPPORTUNITY', 'IN_PROGRESS'].includes(bid?.status || '')
  const isSSG = bid?.bidType === 'SSG'
  const canMarkRead = isMyBid && isSSG && bid?.status === 'ASSIGNED'

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
              <DetailRow label="大区" value={bid.region} />
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
              <DetailRow label="当前状态" value={BID_STATUS_LABELS[bid.status] || bid.status} />
              {bid.assignedToUser && <DetailRow label="负责人" value={bid.assignedToUser.name} />}
            </div>
          </div>

          {/* Summary */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1.5">项目概述</div>
            <p className="text-sm text-slate-700 leading-relaxed">{bid.summary}</p>
            {bid.keywords?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bid.keywords.map(k => (
                  <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{k}</span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap gap-2">
            {canAssign && (
              <Button size="sm" onClick={() => setAssignOpen(true)}>
                {bid.status === 'PENDING' ? '分配' : '重新分配'}
              </Button>
            )}
            {canReceive && (
              <Button size="sm" onClick={() => doStatus('RECEIVED')}>接收标讯</Button>
            )}
            {canProgress && (
              <Button size="sm" onClick={() => doStatus('IN_PROGRESS')}>开始跟进</Button>
            )}
            {canReport && isISG && (
              <Button size="sm" variant="secondary" onClick={() => setShowOppForm(f => !f)}>
                {showOppForm ? '收起' : '报商机'}
              </Button>
            )}
            {canClose && (
              <>
                <Button size="sm" variant="secondary" className="!text-emerald-700 !border-emerald-300" onClick={() => doStatus('WON', '赢单')}>赢单</Button>
                <Button size="sm" variant="secondary" className="!text-red-600 !border-red-300" onClick={() => doStatus('LOST', '输单')}>输单</Button>
              </>
            )}
            {canMarkRead && (
              <Button size="sm" variant="secondary" onClick={() => doStatus('RECEIVED', '已读')}>标记已读</Button>
            )}
          </div>

          {/* Opportunity Form */}
          {showOppForm && isISG && (
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                {existingOpp ? '更新商机' : '上报商机'}
              </div>
              <OpportunityForm bid={bid} existing={existingOpp} onSuccess={() => setShowOppForm(false)} />
            </div>
          )}

          {/* Track Timeline */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-slate-700 mb-3">跟进记录</div>
            <TrackTimeline tracks={tracks} />
          </div>
        </div>
      </aside>

      <DispatchModal bid={bid} open={assignOpen} onClose={() => setAssignOpen(false)} />
    </>
  )
}

const DetailRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex items-start gap-2">
    <span className="text-slate-400 w-16 flex-shrink-0">{label}</span>
    <span className={clsx('flex-1', highlight ? 'text-indigo-700 font-medium' : 'text-slate-700')}>{value}</span>
  </div>
)
