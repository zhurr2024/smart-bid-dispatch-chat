import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBids } from '@/hooks/useBids'
import { useAuthStore } from '@/stores/authStore'
import { BidTypeBadge } from './BidTypeBadge'
import { Spinner } from '@/components/ui/Spinner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import clsx from 'clsx'

interface BidListTableProps {
  filters: Record<string, string>
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

const PAGE_SIZE = 10

export const BidListTable: React.FC<BidListTableProps> = ({ filters, selectedIds = [], onSelectionChange }) => {
  const [page, setPage] = React.useState(1)
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const isPM = user?.role === 'PRODUCT_MGR'

  const { data, isLoading } = useBids({ ...filters, page, pageSize: PAGE_SIZE } as any)
  const bids = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const statusMap: Record<string, { label: string; dot: string }> = {
    UPLOADED: { label: '已上传', dot: 'bg-amber-500' },
    PENDING: { label: '待分配', dot: 'bg-[#9CA3AF]' },
    ASSIGNED: { label: '已分配', dot: 'bg-[#2563EB]' },
    IN_PROGRESS: { label: '跟进中', dot: 'bg-[#4080FF]' },
    LINKED_OPPORTUNITY: { label: '已关联商机', dot: 'bg-[#00B42A]' },
    OPPORTUNITY: { label: '有商机', dot: 'bg-[#00B42A]' },
    NO_OPPORTUNITY: { label: '无商机', dot: 'bg-[#9CA3AF]' },
    COMPLETED: { label: '完成', dot: 'bg-[#00B42A]' },
  }

  const allChecked = bids.length > 0 && bids.every(b => selectedIds.includes(b.id))
  const someChecked = bids.some(b => selectedIds.includes(b.id))

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allChecked) {
      onSelectionChange(selectedIds.filter(id => !bids.find(b => b.id === id)))
    } else {
      const newIds = [...new Set([...selectedIds, ...bids.map(b => b.id)])]
      onSelectionChange(newIds)
    }
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Spinner size={28} />
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#F6F8FA]">
              <th className="text-left font-medium text-[#0F172A] px-4 h-12 w-10">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
                  onChange={toggleAll}
                  className="rounded border-slate-300 cursor-pointer"
                />
              </th>
              {[
                '标讯编号', '项目名称', '采购单位', '类型', '战区', 'BU', '主行业', '预算(万)',
                ...(isPM ? ['关联产品', '匹配关键词', '负责销售'] : ['关联商机编号']),
                '状态', '截止时间', '操作',
              ].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-[#0F172A] px-4 h-12 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bids.map(bid => {
              const s = statusMap[bid.status] || { label: bid.status, dot: 'bg-slate-400' }
              const isChecked = selectedIds.includes(bid.id)
              const daysLeft = bid.deadlineAt
                ? Math.floor((new Date(bid.deadlineAt).getTime() - Date.now()) / 86400000)
                : null
              return (
                <tr
                  key={bid.id}
                  onClick={() => navigate(`/bids/${bid.id}`)}
                  className="bg-white cursor-pointer transition-colors duration-200 hover:bg-[rgba(37,99,235,0.04)] border-b border-[#F2F3F5]"
                >
                  <td className="px-4 h-12" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(bid.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 h-12 text-[#626C7B] whitespace-nowrap">{bid.bidNo}</td>
                  <td className="px-4 h-12 max-w-[200px]">
                    <div className="text-[#0F172A] font-medium leading-snug line-clamp-2" title={bid.projectName}>{bid.projectName}</div>
                  </td>
                  <td className="px-4 h-12 max-w-[160px]">
                    <div className="text-[#626C7B] leading-snug line-clamp-2">{bid.purchaserName}</div>
                  </td>
                  <td className="px-4 h-12">
                    <span className="inline-block text-xs bg-[#F3F5FB] text-[#0F172A] px-2 py-0.5 rounded-[4px]">
                      {bid.tenderType === 'INTENT' ? '意向' : '实时'}
                    </span>
                  </td>
                  <td className="px-4 h-12 text-[#626C7B] whitespace-nowrap">{bid.region}</td>
                  <td className="px-4 h-12"><BidTypeBadge bidType={bid.bidType} /></td>
                  <td className="px-4 h-12 text-[#626C7B] whitespace-nowrap">{bid.industry || '—'}</td>
                  <td className="px-4 h-12 text-[#0F172A] font-medium whitespace-nowrap">
                    {bid.budget ? bid.budget : '—'}
                  </td>
                  {isPM ? (
                    <>
                      <td className="px-4 h-12">
                        {bid.matchedProducts && bid.matchedProducts.length > 0
                          ? bid.matchedProducts.map(mp => (
                              <span key={mp.productName} className="inline-block bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded mr-1 mb-0.5 font-medium">{mp.productName}</span>
                            ))
                          : '—'}
                      </td>
                      <td className="px-4 h-12 max-w-[160px]">
                        {bid.matchedProducts && bid.matchedProducts.length > 0
                          ? bid.matchedProducts.flatMap(mp => mp.matchedKeywords).map(kw => (
                              <span key={kw} className="inline-block bg-[#F3F5FB] text-[#626C7B] px-1.5 py-0.5 rounded-[4px] mr-1 mb-0.5">{kw}</span>
                            ))
                          : '—'}
                      </td>
                      <td className="px-4 h-12 whitespace-nowrap">
                        {bid.assignedToUser ? (
                          <span className="text-[#0F172A]">
                            {bid.assignedToUser.name}
                            <span className="text-[#9CA3AF] ml-1">({bid.assignedTo})</span>
                          </span>
                        ) : (
                          <span className="text-[#C9CDD4]">未分配</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <td className="px-4 h-12 text-[#626C7B] whitespace-nowrap">{bid.opportunityNo || '—'}</td>
                  )}
                  <td className="px-4 h-12">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={clsx('w-2 h-2 rounded-full', s.dot)} />
                      <span className="text-[#626C7B]">{s.label}</span>
                    </span>
                  </td>
                  <td className="px-4 h-12 whitespace-nowrap">
                    {bid.deadlineAt ? (
                      <span className="text-[#626C7B]">
                        {new Date(bid.deadlineAt).toLocaleDateString('zh-CN')}
                        {daysLeft !== null && daysLeft >= 0 && (
                          <span className={clsx('ml-1', daysLeft <= 7 ? 'text-[#F53F3F]' : 'text-[#9CA3AF]')}>
                            （剩余 {daysLeft} 天）
                          </span>
                        )}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 h-12">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/bids/${bid.id}`) }}
                      className="text-xs text-[#2563EB] hover:text-[#0E42D2] cursor-pointer font-medium"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!bids.length && (
          <div className="text-center py-16 text-[#9CA3AF] text-sm">暂无标讯数据</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#F2F3F5] bg-white flex-shrink-0">
        <span className="text-xs text-[#9CA3AF]">共 {total} 条{selectedIds.length > 0 && `，已选 ${selectedIds.length} 条`}</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={14} />
          </Button>
          <span className="text-xs text-[var(--text-2)]">{page} / {Math.max(1, totalPages)}</span>
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
