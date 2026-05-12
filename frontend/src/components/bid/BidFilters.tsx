import React, { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { useAuthStore } from '@/stores/authStore'
import { mockProductKeywordMappings } from '@/mocks/data/products'

interface BidFiltersProps {
  onChange: (filters: Record<string, string>) => void
}

const REGIONS = [
  '浙江', '北京', '川藏', '广东', '安徽', '山东', '江苏', '河南', '湖北', '上海',
  '山西', '福建', '甘青宁', '云贵', '深琼', '江西', '广西', '河北', '湖南', '黑吉',
  '新疆', '辽宁', '陕西', '内蒙古', '重庆', '天津',
]
const INDUSTRIES = [
  { value: '政府', label: '政府' },
  { value: '教育', label: '教育' },
  { value: '医疗卫生', label: '医疗卫生' },
  { value: '企业', label: '企业' },
  { value: '金融', label: '金融' },
  { value: '公交能', label: '公交能' },
  { value: '媒体', label: '媒体' },
  { value: '交通', label: '交通' },
  { value: '互联网服务', label: '互联网服务' },
  { value: '专业服务', label: '专业服务' },
]
const STATUSES = [
  { value: 'UPLOADED', label: '已上传' },
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
  const user = useAuthStore(s => s.user)
  const isPM = user?.role === 'PRODUCT_MGR'

  // Products owned by this PM
  const pmProducts = isPM
    ? mockProductKeywordMappings.filter(p => p.productManagerId === user.id)
    : []

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
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 min-w-36">
        <Search size={14} className="text-slate-400" />
        <input
          placeholder="关联商机编号..."
          className="bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 w-full"
          onChange={set('opportunityNo')}
        />
      </div>
      <Select placeholder="全部战区" options={REGIONS.map(r => ({ value: r, label: r }))} onChange={set('region')} className="text-sm py-1.5" />
      <Select placeholder="全部主行业" options={INDUSTRIES} onChange={set('industry')} className="text-sm py-1.5" />
      <Select placeholder="全部BU" options={BID_TYPES} onChange={set('bidType')} className="text-sm py-1.5" />
      <Select placeholder="全部招标类型" options={TENDER_TYPES} onChange={set('tenderType')} className="text-sm py-1.5" />
      <Select placeholder="全部状态" options={STATUSES} onChange={set('status')} className="text-sm py-1.5" />
      {isPM && pmProducts.length > 0 && (
        <Select
          placeholder="全部关联产品"
          options={pmProducts.map(p => ({ value: p.productName, label: p.productName }))}
          onChange={set('productName')}
          className="text-sm py-1.5"
        />
      )}
    </div>
  )
}
