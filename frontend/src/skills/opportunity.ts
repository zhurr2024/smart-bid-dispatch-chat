import { Opportunity, OpportunityStage } from '@/types'

export const STAGE_ORDER: OpportunityStage[] = [
  'INITIAL_CONTACT',
  'SOLUTION_DISCUSS',
  'QUOTATION',
  'APPROVAL',
  'SIGNING',
]

export const STAGE_LABELS: Record<OpportunityStage, string> = {
  INITIAL_CONTACT: '初步接触',
  SOLUTION_DISCUSS: '方案沟通',
  QUOTATION: '报价阶段',
  APPROVAL: '审批中',
  SIGNING: '签约',
}

export const STAGE_COLORS: Record<OpportunityStage, { bg: string; text: string }> = {
  INITIAL_CONTACT: { bg: 'bg-slate-200', text: 'text-slate-700' },
  SOLUTION_DISCUSS: { bg: 'bg-blue-100', text: 'text-blue-700' },
  QUOTATION: { bg: 'bg-amber-100', text: 'text-amber-700' },
  APPROVAL: { bg: 'bg-purple-100', text: 'text-purple-700' },
  SIGNING: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

/** Get the next stage in the pipeline */
export function getNextStage(current: OpportunityStage): OpportunityStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

/** Determine if opportunity can be advanced (not in final stage, not closed) */
export function canAdvance(opp: Opportunity): boolean {
  if (opp.result) return false
  return getNextStage(opp.stage) !== null
}

/** Get WinLoss status label and color */
export function getResultLabel(result?: 'WON' | 'LOST' | 'ABANDONED'): {
  label: string
  colorClass: string
} {
  switch (result) {
    case 'WON':       return { label: '赢单',   colorClass: 'text-emerald-600' }
    case 'LOST':      return { label: '输单',   colorClass: 'text-red-500' }
    case 'ABANDONED': return { label: '已放弃', colorClass: 'text-slate-400' }
    default:          return { label: '进行中', colorClass: 'text-indigo-600' }
  }
}

/**
 * Validate opportunity form data before submission.
 * Returns array of error messages (empty = valid).
 */
export function validateOpportunity(data: Partial<Opportunity>): string[] {
  const errors: string[] = []
  if (!data.opportunityName?.trim()) errors.push('商机名称不能为空')
  if (data.estimatedAmount !== undefined && data.estimatedAmount !== null) {
    if (isNaN(data.estimatedAmount) || data.estimatedAmount < 0)
      errors.push('预计金额必须为非负数')
  }
  if (data.estimatedCloseDate) {
    if (isNaN(new Date(data.estimatedCloseDate).getTime()))
      errors.push('预计关闭日期格式无效')
  }
  if (!data.stage || !STAGE_ORDER.includes(data.stage)) errors.push('请选择有效的阶段')
  if (!data.bidId?.trim()) errors.push('必须关联标讯')
  return errors
}

/**
 * Calculate opportunity health score (0-100)
 * based on stage progress, estimated amount, close date, and activity.
 */
export function calcOpportunityHealth(opp: Opportunity): number {
  let score = 0

  // Stage progress — up to 40 pts
  const stageIdx = STAGE_ORDER.indexOf(opp.stage)
  score += Math.round(((stageIdx + 1) / STAGE_ORDER.length) * 40)

  // Estimated amount — up to 20 pts
  if (opp.estimatedAmount) {
    if (opp.estimatedAmount >= 500) score += 20
    else if (opp.estimatedAmount >= 100) score += 15
    else score += 10
  }

  // Close date — up to 20 pts; overdue = 0
  if (opp.estimatedCloseDate) {
    const daysLeft = Math.floor(
      (new Date(opp.estimatedCloseDate).getTime() - Date.now()) / 86400000,
    )
    if (daysLeft > 30) score += 20
    else if (daysLeft >= 0) score += 10
  }

  // Staleness penalty — up to -20 pts
  const daysActive = Math.floor(
    (Date.now() - new Date(opp.createdAt).getTime()) / 86400000,
  )
  if (daysActive > 180) score -= 20
  else if (daysActive > 90) score -= 10
  else if (daysActive > 30) score -= 5

  // Competitors recorded — +10 pts
  if (opp.competitors && opp.competitors.length > 0) score += 10

  // Notes present — +10 pts
  if (opp.notes?.trim()) score += 10

  // Closed-lost or abandoned cap
  if (opp.result === 'LOST' || opp.result === 'ABANDONED') score = Math.min(score, 20)

  return Math.max(0, Math.min(100, score))
}
