import React, { useState } from 'react'
import { BidFilters } from '@/components/bid/BidFilters'
import { BidListTable } from '@/components/bid/BidListTable'

export default function BidsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <h1 className="font-semibold text-slate-900">标讯管理</h1>
        <p className="text-xs text-slate-500 mt-0.5">查看、筛选和管理全部标讯</p>
      </div>
      <BidFilters onChange={setFilters} />
      <BidListTable filters={filters} />
    </div>
  )
}
