import React, { useMemo } from 'react'
import { KpiCards } from '@/components/reports/KpiCards'
import { TrendChart } from '@/components/reports/TrendChart'
import { RegionChart } from '@/components/reports/RegionChart'
import { FunnelChart } from '@/components/reports/FunnelChart'
import { useReportOverview, useReportTrend, useReportRegion, useReportFunnel } from '@/hooks/useReports'
import { Spinner } from '@/components/ui/Spinner'
import { generateInsight, type InsightSummary } from '@/skills/report-engine'

// ---------------------------------------------------------------------------
// InsightCard component
// ---------------------------------------------------------------------------

const TREND_ICON: Record<InsightSummary['trend'], { icon: string; color: string }> = {
  UP:     { icon: '↑', color: 'text-emerald-600' },
  DOWN:   { icon: '↓', color: 'text-red-500' },
  STABLE: { icon: '→', color: 'text-slate-400' },
}

function InsightCard({ summary }: { summary: InsightSummary }) {
  const { icon, color } = TREND_ICON[summary.trend]

  return (
    <div className="bg-white rounded-[8px] border border-[var(--border-2)] shadow-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📊</span>
        <h2 className="font-semibold text-[var(--text-1)] text-sm flex-1">经营洞察摘要</h2>
        <span className={`text-lg font-bold leading-none ${color}`} aria-label={`趋势：${summary.trend}`}>
          {icon}
        </span>
      </div>

      {/* Headline */}
      <p className="text-[var(--text-1)] font-semibold text-base leading-snug mb-4">
        {summary.headline}
      </p>

      {/* Highlights */}
      <ul className="space-y-2 mb-4">
        {summary.highlights.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
            <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Alert (conditional) */}
      {summary.alert && (
        <div className="flex items-start gap-2 rounded-[8px] bg-amber-50 border border-amber-200 px-4 py-3">
          <span className="shrink-0 text-amber-500 mt-0.5">⚠</span>
          <p className="text-sm text-amber-800 leading-snug">{summary.alert}</p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const { data: overview, isLoading: l1 } = useReportOverview()
  const { data: trend = [], isLoading: l2 } = useReportTrend()
  const { data: region = [], isLoading: l3 } = useReportRegion()
  const { data: funnel = [], isLoading: l4 } = useReportFunnel()

  const loading = l1 || l2 || l3 || l4

  const insight = useMemo(() => {
    if (!overview) return null
    return generateInsight(overview, trend, region)
  }, [overview, trend, region])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-semibold text-[var(--text-1)] text-lg">数据报表</h1>
        <p className="text-sm text-[var(--text-3)] mt-0.5">标讯经营数据总览与分析</p>
      </div>

      {/* AI Insight Summary — shown before charts */}
      {insight && <InsightCard summary={insight} />}

      {overview && <KpiCards data={overview} />}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-[8px] border border-[var(--border-2)] shadow-card p-5">
          <h3 className="font-semibold text-[var(--text-1)] text-sm mb-4">标讯量月度趋势</h3>
          <TrendChart data={trend} />
        </div>
        <div className="bg-white rounded-[8px] border border-[var(--border-2)] shadow-card p-5">
          <h3 className="font-semibold text-[var(--text-1)] text-sm mb-4">大区分布</h3>
          <RegionChart data={region} />
        </div>
      </div>

      <div className="bg-white rounded-[8px] border border-[var(--border-2)] shadow-card p-5">
        <h3 className="font-semibold text-[var(--text-1)] text-sm mb-1">转化漏斗（WinLoss）</h3>
        <p className="text-xs text-[var(--text-3)] mb-4">从标讯总量到赢单的全链路转化</p>
        <FunnelChart data={funnel} />
      </div>
    </div>
  )
}
