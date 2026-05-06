import React, { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Select } from '@/components/ui/Select'

interface BidFiltersProps {
  onChange: (filters: Record<string, string>) => void
}

const REGIONS = ['华南', '华东', '华北', '西南', '华中']
const PRIORITIES = [
  { value: 'HIGH', label: '高优先级' },
  { value: 'MEDIUM', label: '中优先级' },
  { value: 'LOW', label: '低优先级' },
]
const STATUSES = [
  { value: 'PENDING', label: '待分配' },
  { value: 'ASSIGNED', label: '已分配' },
  { value: 'RECEIVED', label: '已接收' },
  { value: 'IN_PROGRESS', label: '跟进中' },
  { value: 'OPPORTUNITY', label: '有商机' },
  { value: 'NO_OPPORTUNITY', label: '无商机' },
  { value: 'COMPLETED', label: '完成' },
]
const BID_TYPES = [
  { value: 'ISG', label: 'ISG' },
  { value: 'SSG', label: 'SSG' },
]
const TENDER_TYPES = [
  { value: 'INTENT', label: '意向招标' },
  { value: 'FORMAL', label: '实时招标' },
]

export const BidFilters: React.FC<BidFiltersProps> = ({ onChange }) => {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const updated = { ...filters, [key]: e.target.value }
    // Remove empty values
    Object.keys(updated).forEach(k => { if (!updated[k]) delete updated[k] })
    setFilters(updated)
    onChange(updated)
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-b border-slate-200 flex-wrap">
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 min-w-48">
        <Search size={14} className="text-slate-400" />
        <input
          placeholder="搜索项目名/采购方..."
          className="bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 w-full"
          onChange={set('search')}
        />
      </div>
      <Select placeholder="全部战区" options={REGIONS.map(r => ({ value: r, label: r }))} onChange={set('region')} className="text-sm py-1.5" />
      <Select placeholder="全部BU" options={BID_TYPES} onChange={set('bidType')} className="text-sm py-1.5" />
      <Select placeholder="全部招标类型" options={TENDER_TYPES} onChange={set('tenderType')} className="text-sm py-1.5" />
      <Select placeholder="全部优先级" options={PRIORITIES} onChange={set('priority')} className="text-sm py-1.5" />
      <Select placeholder="全部状态" options={STATUSES} onChange={set('status')} className="text-sm py-1.5" />
    </div>
  )
}
