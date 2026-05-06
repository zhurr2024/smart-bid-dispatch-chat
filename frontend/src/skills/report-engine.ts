// NOTE: This file lives at src/skills/report-engine.ts
// Once the `src/skills/report-engine/` directory is created, move this file
// to src/skills/report-engine/insightEngine.ts and re-export it via index.ts.

import { ReportOverview, TrendData, RegionData } from '@/types'

export interface InsightSummary {
  headline: string        // one-sentence key insight
  highlights: string[]    // 3-4 bullet points
  trend: 'UP' | 'DOWN' | 'STABLE'
  alert?: string          // optional warning if something looks bad
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function analyzeTrend(trends: TrendData[]): 'UP' | 'DOWN' | 'STABLE' {
  if (trends.length < 2) return 'STABLE'
  const recent = trends.slice(-3)
  if (recent.length < 2) return 'STABLE'
  const first = recent[0].total
  const last = recent[recent.length - 1].total
  if (first === 0) return 'STABLE'
  const changePct = (last - first) / first
  if (changePct > 0.05) return 'UP'
  if (changePct < -0.05) return 'DOWN'
  return 'STABLE'
}

function buildHeadline(
  overview: ReportOverview,
  trend: 'UP' | 'DOWN' | 'STABLE',
  topRegion: RegionData | null
): string {
  const trendText =
    trend === 'UP' ? '持续增长' : trend === 'DOWN' ? '有所回落' : '保持平稳'
  const regionText = topRegion ? `，${topRegion.region}大区表现最佳` : ''
  return `本期共接收标讯 ${overview.totalBids} 条，整体趋势${trendText}${regionText}，转化率 ${overview.conversionRate.toFixed(1)}%。`
}

function buildHighlights(
  overview: ReportOverview,
  trend: 'UP' | 'DOWN' | 'STABLE',
  topRegion: RegionData | null,
  efficiency: number
): string[] {
  const highlights: string[] = []

  const highPriorityPct =
    overview.totalBids > 0
      ? ((overview.highPriorityBids / overview.totalBids) * 100).toFixed(1)
      : '0'
  highlights.push(
    `高优先级标讯占比 ${highPriorityPct}%，共 ${overview.highPriorityBids} 条需重点跟进`
  )

  const efficiencyLabel =
    efficiency >= 70 ? '处于良好水平' : efficiency >= 40 ? '有提升空间' : '需重点改善'
  highlights.push(
    `平均响应时效 ${overview.avgResponseHours.toFixed(1)} 小时，效率评分 ${efficiency} 分，${efficiencyLabel}`
  )

  if (topRegion) {
    const winRate =
      topRegion.count > 0
        ? ((topRegion.won / topRegion.count) * 100).toFixed(1)
        : '0'
    highlights.push(
      `${topRegion.region}大区赢单率最高，达 ${winRate}%，共赢单 ${topRegion.won} 条`
    )
  }

  const trendText =
    trend === 'UP'
      ? '近三月标讯量呈上升趋势，业务拓展态势良好'
      : trend === 'DOWN'
        ? '近三月标讯量有所下降，建议加强渠道拓展'
        : '近三月标讯量基本稳定，业务进入平稳期'
  highlights.push(trendText)

  return highlights
}

function buildAlert(
  overview: ReportOverview,
  isBadConversion: boolean
): string | undefined {
  const alerts: string[] = []

  if (isBadConversion) {
    alerts.push(
      `转化率仅 ${overview.conversionRate.toFixed(1)}%，远低于5%警戒线，请关注跟进质量`
    )
  }
  if (overview.avgResponseHours > 48) {
    alerts.push(
      `平均响应时效 ${overview.avgResponseHours.toFixed(1)} 小时，超过48小时警戒值，建议优化分配流程`
    )
  }
  if (overview.totalBids > 0 && overview.pendingBids / overview.totalBids > 0.3) {
    const pendingPct = ((overview.pendingBids / overview.totalBids) * 100).toFixed(1)
    alerts.push(`待处理标讯 ${overview.pendingBids} 条（占比 ${pendingPct}%），积压较多请及时处置`)
  }

  return alerts.length > 0 ? alerts.join('；') : undefined
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable insight summary from report data.
 * Analyzes last-3-month trends, conversion rate thresholds, and top region.
 */
export function generateInsight(
  overview: ReportOverview,
  trends: TrendData[],
  regions: RegionData[]
): InsightSummary {
  const trend = analyzeTrend(trends)
  const topRegion = getTopRegion(regions)
  const efficiency = calcEfficiencyScore(overview)
  const isBadConversion = overview.conversionRate < 5

  return {
    headline: buildHeadline(overview, trend, topRegion),
    highlights: buildHighlights(overview, trend, topRegion, efficiency),
    trend,
    alert: buildAlert(overview, isBadConversion),
  }
}

/**
 * Format conversion rate as a percentage string with trend indicator.
 * >15% → "12.5% ↑", <5% → "8.3% ↓", otherwise "11.0% →"
 */
export function formatConversionRate(rate: number): string {
  const formatted = rate.toFixed(1) + '%'
  if (rate > 15) return `${formatted} ↑`
  if (rate < 5) return `${formatted} ↓`
  return `${formatted} →`
}

/**
 * Get the top-performing region ranked by won/count ratio.
 */
export function getTopRegion(regions: RegionData[]): RegionData | null {
  if (regions.length === 0) return null
  return regions.reduce((best, current) => {
    const bestRate = best.count > 0 ? best.won / best.count : 0
    const currentRate = current.count > 0 ? current.won / current.count : 0
    return currentRate > bestRate ? current : best
  })
}

/**
 * Calculate response efficiency score (0–100).
 * 50 pts: avgResponseHours normalised on 0–72h scale (lower = better)
 * 50 pts: conversionRate normalised on 0–30% scale (higher = better)
 */
export function calcEfficiencyScore(overview: ReportOverview): number {
  const MAX_HOURS = 72
  const MAX_RATE = 30

  const hoursScore = Math.max(0, 1 - overview.avgResponseHours / MAX_HOURS) * 50
  const rateScore = Math.min(overview.conversionRate / MAX_RATE, 1) * 50

  return Math.round(hoursScore + rateScore)
}
