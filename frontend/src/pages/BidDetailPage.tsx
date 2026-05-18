import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Link2, PlusCircle, XCircle, Clock, CheckCircle } from 'lucide-react'
import { useBid, useBidTracks, useUpdateBidStatus, useMarkBidRead } from '@/hooks/useBids'
import { useAuthStore } from '@/stores/authStore'
import { BidTypeBadge, TenderTypeBadge } from '@/components/bid/BidTypeBadge'
import { TrackTimeline } from '@/components/opportunity/TrackTimeline'
import { NoOpportunityModal } from '@/components/bid/NoOpportunityModal'
import { FollowUpModal } from '@/components/bid/FollowUpModal'
import { CreateOpportunityForm } from '@/components/bid/CreateOpportunityForm'
import { Button } from '@/components/ui/Button'
import { DispatchModal } from '@/components/bid/DispatchModal'
import { Spinner } from '@/components/ui/Spinner'
import { Input } from '@/components/ui/Input'
import { BidStatus } from '@/types'
import { IS_REAL_BID_OPTIONS, HIGH_VALUE_OPTIONS, FEEDBACK_STATUS_LABELS } from '@/constants/feedbackEnums'
import clsx from 'clsx'

const STATUS_LABELS: Record<string, string> = {
  UPLOADED: '已上传',
  PENDING: '待分配',
  ASSIGNED: '已分配（待反馈）',
  IN_PROGRESS: '跟进中',
  OPPORTUNITY: '已创建商机',
  NO_OPPORTUNITY: '无商机',
  LINKED_OPPORTUNITY: '已关联商机',
  COMPLETED: '完成',
}

const STATUS_COLORS: Record<string, string> = {
  UPLOADED: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING: 'bg-[var(--fill-2)] text-[var(--text-2)] border-[var(--border-2)]',
  ASSIGNED: 'bg-[var(--brand-1)] text-[var(--brand-6)] border-[var(--brand-2)]',
  IN_PROGRESS: 'bg-[var(--brand-1)] text-[var(--brand-7)] border-[var(--brand-3)]',
  OPPORTUNITY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  NO_OPPORTUNITY: 'bg-[var(--fill-2)] text-[var(--text-3)] border-[var(--border-2)]',
  LINKED_OPPORTUNITY: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-purple-50 text-purple-700 border-purple-200',
}

type TabKey = 'info' | 'track'

export default function BidDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { data: bid, isLoading } = useBid(id || null)
  const { data: tracks = [] } = useBidTracks(id || null)
  const updateStatus = useUpdateBidStatus()
  const markRead = useMarkBidRead()
  const [assignOpen, setAssignOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('info')

  // New feedback flow states
  const [noOppOpen, setNoOppOpen] = useState(false)
  const [followUpOpen, setFollowUpOpen] = useState(false)
  const [createOppOpen, setCreateOppOpen] = useState(false)
  const [linkOppNo, setLinkOppNo] = useState('')
  const [showLinkOppInput, setShowLinkOppInput] = useState(false)

  useEffect(() => {
    if (bid && bid.bidType === 'SSG' && !bid.isRead) {
      markRead.mutate(bid.id)
    }
  }, [bid?.id, bid?.isRead])

  const isISG = bid?.bidType === 'ISG'
  const canAssign = user?.role === 'SALES_ADMIN' && bid?.status === 'PENDING' && isISG
  const isMyBid = user?.role === 'AR' && user.id === bid?.assignedTo
  const isAR = user?.role === 'AR'

  // AR can provide feedback when bid is ASSIGNED or IN_PROGRESS
  const canFeedback = isMyBid && (bid?.status === 'ASSIGNED' || bid?.status === 'IN_PROGRESS')
  // Non-AR roles can only view
  const isViewOnly = !isAR

  // Step 1: 真实性判断 - AR needs to determine if bid contains ISG products
  const needsRealBidCheck = isMyBid && bid?.status === 'ASSIGNED' && bid?.isRealBid === undefined

  const doStatus = async (status: BidStatus, note?: string) => {
    if (!bid) return
    await updateStatus.mutateAsync({ id: bid.id, status, note })
  }

  const handleNotRealBid = async (reason: string) => {
    if (!bid) return
    await updateStatus.mutateAsync({
      id: bid.id,
      status: 'NO_OPPORTUNITY',
      note: `非ISG产品标讯，原因：${reason}`,
    })
  }

  const handleNoOpportunity = async (reason: string, note: string) => {
    if (!bid) return
    const fullNote = note ? `${reason}：${note}` : reason
    await updateStatus.mutateAsync({ id: bid.id, status: 'NO_OPPORTUNITY', note: `无商机 - ${fullNote}` })
  }

  const handleFollowUp = async (remark: string) => {
    if (!bid) return
    await updateStatus.mutateAsync({ id: bid.id, status: 'IN_PROGRESS', note: remark })
  }

  const handleLinkOpportunity = async () => {
    if (!bid || !linkOppNo.trim()) return
    await updateStatus.mutateAsync({ id: bid.id, status: 'LINKED_OPPORTUNITY' as BidStatus, note: `关联商机编号：${linkOppNo.trim()}` })
    setLinkOppNo('')
    setShowLinkOppInput(false)
  }
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!bid) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--text-3)]">标讯不存在</p>
        <Button variant="secondary" onClick={() => navigate('/bids')}>
          <ArrowLeft size={14} />
          返回列表
        </Button>
      </div>
    )
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: '基本信息' },
    { key: 'track', label: '跟进记录' },
  ]

  return (
    <div className="h-full flex flex-col bg-[var(--fill-1)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border-2)] px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => navigate('/bids')}
            className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer p-1 rounded-[4px] hover:bg-[var(--fill-2)]"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <BidTypeBadge bidType={bid.bidType} />
            <TenderTypeBadge tenderType={bid.tenderType} />
          </div>
          <span className={clsx('text-xs px-2.5 py-1 rounded-[4px] font-medium border', STATUS_COLORS[bid.status])}>
            {STATUS_LABELS[bid.status] || bid.status}
          </span>
        </div>
        <h1 className="text-lg font-semibold text-[var(--text-1)] leading-snug">{bid.projectName}</h1>
        <p className="text-xs text-[var(--text-3)] mt-1">标讯编号：{bid.bidNo}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {canAssign && (
            <Button size="sm" onClick={() => setAssignOpen(true)}>分配标讯</Button>
          )}

          {/* AR反馈操作按钮 */}
          {canFeedback && (
            <>
              <Button size="sm" variant="secondary" className="!text-[var(--text-2)] !border-[var(--border-2)]" onClick={() => setNoOppOpen(true)}>
                <XCircle size={14} />
                无商机
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowLinkOppInput(true)}>
                <Link2 size={14} />
                关联商机
              </Button>
              <Button size="sm" onClick={() => setCreateOppOpen(true)}>
                <PlusCircle size={14} />
                创建商机
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setFollowUpOpen(true)}>
                <Clock size={14} />
                跟进中
              </Button>
            </>
          )}


        </div>

        {/* 关联商机输入 */}
        {showLinkOppInput && (
          <div className="flex items-end gap-2 mt-3 p-3 bg-[var(--fill-1)] rounded-[6px]">
            <div className="flex-1">
              <Input
                label="商机编号"
                value={linkOppNo}
                onChange={(e) => setLinkOppNo(e.target.value)}
                placeholder="请输入已有商机编号..."
              />
            </div>
            <Button size="sm" onClick={handleLinkOpportunity} disabled={!linkOppNo.trim()}>
              确认关联
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setShowLinkOppInput(false); setLinkOppNo('') }}>
              取消
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[var(--border-2)] px-6 flex-shrink-0">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'px-4 py-3 text-sm font-medium cursor-pointer transition-colors relative',
                activeTab === tab.key
                  ? 'text-[var(--brand-6)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-6)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-[8px] shadow-card p-6">
              <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">项目信息</h3>
              <div className="space-y-3">
                <InfoRow label="采购单位" value={bid.purchaserName} />
                <InfoRow label="项目地点" value={bid.location} />
                <InfoRow label="战区" value={bid.region} />
                {bid.industry && <InfoRow label="主行业" value={bid.industry} />}
                {bid.budget && <InfoRow label="预算金额" value={`约 ${bid.budget} 万元`} highlight />}
                <InfoRow label="采购开始时间" value={new Date(bid.publishedAt).toLocaleDateString('zh-CN')} />
                {bid.deadlineAt && (
                  <InfoRow
                    label="采购截止时间"
                    value={new Date(bid.deadlineAt).toLocaleDateString('zh-CN')}
                    highlight={new Date(bid.deadlineAt).getTime() - Date.now() < 7 * 86400000}
                  />
                )}
                {bid.assignedToUser && <InfoRow label="负责人" value={bid.assignedToUser.name} />}
                {bid.opportunityNo && <InfoRow label="商机编号" value={bid.opportunityNo} />}
                <InfoRow label="是否高价值" value={bid.isHighValue === true ? '是' : bid.isHighValue === false ? '否' : '未标记'} />
                {bid.isRealBid !== undefined && bid.isRealBid !== null && (
                  <InfoRow label="ISG产品" value={bid.isRealBid ? '是' : '否'} />
                )}
                {bid.feedbackStatus && (
                  <InfoRow label="反馈状态" value={FEEDBACK_STATUS_LABELS[bid.feedbackStatus] || bid.feedbackStatus} />
                )}
                {bid.noOpportunityReason && (
                  <InfoRow label="无商机原因" value={bid.noOpportunityReason} />
                )}
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-[8px] shadow-card p-6">
              <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">项目概述</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">{bid.summary}</p>
              {bid.keywords && bid.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {bid.keywords.map(k => (
                    <span key={k} className="text-xs bg-[var(--fill-2)] text-[var(--text-2)] px-2 py-0.5 rounded-[4px]">{k}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Matching */}
            {bid.matchedProducts && bid.matchedProducts.length > 0 && (
              <div className="bg-white rounded-[8px] shadow-card p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">关联产品</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bid.matchedProducts.map(mp => (
                    <div key={mp.productName} className="p-3 bg-purple-50 rounded-[8px] border border-purple-100">
                      <div className="text-sm font-semibold text-purple-800">{mp.productName}</div>
                      <div className="text-xs text-purple-600 mt-1">产品经理：{mp.productManager}</div>
                      {mp.arName && (
                        <div className="text-xs text-[var(--text-2)] mt-0.5">
                          负责销售：{mp.arName}
                          {mp.arItcode && <span className="text-[var(--text-3)] ml-1">({mp.arItcode})</span>}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mp.matchedKeywords.map(kw => (
                          <span key={kw} className="text-xs bg-white text-purple-700 px-1.5 py-0.5 rounded-[4px] border border-purple-200">{kw}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'track' && (
          <div className="bg-white rounded-[8px] shadow-card p-6 max-w-2xl">
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">跟进记录</h3>
            <TrackTimeline tracks={tracks} />
          </div>
        )}


      </div>

      {canAssign && <DispatchModal bid={bid} open={assignOpen} onClose={() => setAssignOpen(false)} />}
      <NoOpportunityModal
        open={noOppOpen}
        onClose={() => setNoOppOpen(false)}
        onConfirm={handleNoOpportunity}
      />
      <FollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onConfirm={handleFollowUp}
      />
      <CreateOpportunityForm
        bid={bid}
        open={createOppOpen}
        onClose={() => setCreateOppOpen(false)}
        onSuccess={() => setCreateOppOpen(false)}
      />
    </div>
  )
}

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <span className="text-xs text-[var(--text-3)] w-16 flex-shrink-0 pt-0.5">{label}</span>
    <span className={clsx('text-sm flex-1', highlight ? 'text-[var(--brand-6)] font-medium' : 'text-[var(--text-1)]')}>{value}</span>
  </div>
)
