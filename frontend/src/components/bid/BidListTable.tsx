import React from 'react'
import { useBids } from '@/hooks/useBids'
import { useUiStore } from '@/stores/uiStore'
import { PriorityBadge } from './PriorityBadge'
import { BidTypeBadge, TenderTypeBadge } from './BidTypeBadge'
import { Spinner } from '@/components/ui/Spinner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import clsx from 'clsx'

interface BidListTableProps {
  filters: Record<string, string>
}

const PAGE_SIZE = 10

export const BidListTable: React.FC<BidListTableProps> = ({ filters }) => {
  const [page, setPage] = React.useState(1)
  const setSelectedBidId = useUiStore(s => s.setSelectedBidId)
  const selectedBidId = useUiStore(s => s.selectedBidId)

  const { data, isLoading } = useBids({ ...filters, page, pageSize: PAGE_SIZE } as any)
  const bids = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const statusMap: Record<string, { label: string; cls: string }> = {
    PENDING: { label: '待分配', cls: 'bg-slate-100 text-slate-600' },
    ASSIGNED: { label: '已分配', cls: 'bg-blue-50 text-blue-700' },
    RECEIVED: { label: '已接收', cls: 'bg-sky-50 text-sky-700' },
    IN_PROGRESS: { label: '跟进中', cls: 'bg-indigo-50 text-indigo-700' },
    OPPORTUNITY: { label: '商机上报', cls: 'bg-purple-50 text-purple-700' },
    WON: { label: '赢单', cls: 'bg-emerald-50 text-emerald-700' },
    LOST: { label: '输单', cls: 'bg-red-50 text-red-700' },
    ABANDONED: { label: '已放弃', cls: 'bg-slate-100 text-slate-400' },
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Spinner size={28} />
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-200">
              {['标讯编号', 'BU', '类型', '项目名称', '采购单位', '大区', '预算(万)', '优先级', '状态', '截止时间', '操作'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bids.map(bid => {
              const s = statusMap[bid.status] || { label: bid.status, cls: 'bg-slate-100 text-slate-600' }
              const isSelected = selectedBidId === bid.id
              const daysLeft = bid.deadlineAt
                ? Math.floor((new Date(bid.deadlineAt).getTime() - Date.now()) / 86400000)
                : null
              return (
                <tr
                  key={bid.id}
                  onClick={() => setSelectedBidId(isSelected ? null : bid.id)}
                  className={clsx(
                    'border-b border-slate-100 cursor-pointer transition-colors',
                    isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  )}
                >
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{bid.bidNo}</td>
                  <td className="px-4 py-3"><BidTypeBadge bidType={bid.bidType} /></td>
                  <td className="px-4 py-3"><TenderTypeBadge tenderType={bid.tenderType} /></td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="truncate font-medium text-slate-900" title={bid.projectName}>{bid.projectName}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">
                    <div className="truncate">{bid.purchaserName}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{bid.region}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                    {bid.budget ? bid.budget : '—'}
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={bid.priority} /></td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', s.cls)}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {bid.deadlineAt ? (
                      <span className={clsx(daysLeft !== null && daysLeft <= 7 ? 'text-red-600 font-medium' : 'text-slate-500')}>
                        {new Date(bid.deadlineAt).toLocaleDateString('zh-CN')}
                        {daysLeft !== null && daysLeft >= 0 && <span className="ml-1">({daysLeft}天)</span>}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedBidId(bid.id) }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
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
          <div className="text-center py-16 text-slate-400 text-sm">暂无标讯数据</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
        <span className="text-xs text-slate-500">共 {total} 条</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={14} />
          </Button>
          <span className="text-xs text-slate-600">{page} / {Math.max(1, totalPages)}</span>
          <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
