import React from 'react'
import { TrendingUp, TrendingDown, FileText, Clock, Award, AlertTriangle } from 'lucide-react'
import { ReportOverview } from '@/types'

interface KpiCardsProps { data: ReportOverview }

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const cards = [
    {
      label: '本月标讯总量',
      value: data.totalBids,
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-700',
      iconBg: 'bg-indigo-100',
    },
    {
      label: '高优先级标讯',
      value: data.highPriorityBids,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700',
      iconBg: 'bg-red-100',
      sub: `占比 ${data.totalBids ? Math.round(data.highPriorityBids / data.totalBids * 100) : 0}%`,
    },
    {
      label: '平均首响应时长',
      value: `${data.avgResponseHours}h`,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
      iconBg: 'bg-amber-100',
      sub: data.avgResponseHours <= 24 ? '达标' : '超时',
    },
    {
      label: '商机转化率',
      value: `${data.conversionRate}%`,
      icon: Award,
      color: 'bg-emerald-50 text-emerald-700',
      iconBg: 'bg-emerald-100',
      sub: `赢单 ${data.wonBids} 笔`,
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`rounded-xl p-5 ${c.color} flex items-center gap-4`}>
          <div className={`${c.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <c.icon size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold leading-none mb-1">{c.value}</div>
            <div className="text-sm opacity-80">{c.label}</div>
            {c.sub && <div className="text-xs opacity-60 mt-0.5">{c.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
