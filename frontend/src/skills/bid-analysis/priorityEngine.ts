import { Bid, Priority } from '@/types'

export function calculatePriority(bid: Partial<Bid>): Priority {
  const score = getPriorityScore(bid)
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

export function getPriorityScore(bid: Partial<Bid>): number {
  let score = 0

  // 意向招标基础分
  if (bid.tenderType === 'INTENT') score += 30
  else score += 10

  // 预算金额评分
  const budget = bid.budget || 0
  if (budget >= 1000) score += 40
  else if (budget >= 500) score += 30
  else if (budget >= 100) score += 15
  else score += 0

  // 截止日期紧迫度
  if (bid.deadlineAt) {
    const daysLeft = Math.floor(
      (new Date(bid.deadlineAt).getTime() - Date.now()) / 86400000
    )
    if (daysLeft <= 7) score += 30
    else if (daysLeft <= 30) score += 15
    else score += 5
  }

  // 信息完整度
  const hasComplete = bid.projectName && bid.purchaserName && bid.summary && bid.budget
  if (!hasComplete) score -= 10

  return Math.max(0, Math.min(100, score))
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: '高优先级',
  MEDIUM: '中优先级',
  LOW: '低优先级',
}

export const BID_STATUS_LABELS = {
  PENDING: '待分配',
  ASSIGNED: '已分配',
  RECEIVED: '已接收',
  IN_PROGRESS: '跟进中',
  OPPORTUNITY: '有商机',
  NO_OPPORTUNITY: '无商机',
  COMPLETED: '完成',
}

export const TENDER_TYPE_LABELS = {
  INTENT: '意向招标',
  FORMAL: '实时招标',
}

/**
 * Get urgency label and color based on priority + deadline proximity
 */
export function getUrgencyLabel(bid: Partial<Bid>): {
  label: string
  colorClass: string   // Tailwind text color class
  bgClass: string      // Tailwind bg color class
} {
  const priority = bid.priority ?? calculatePriority(bid)
  if (priority === 'HIGH') return { label: '紧急', colorClass: 'text-red-600', bgClass: 'bg-red-50' }
  if (priority === 'MEDIUM') return { label: '中优', colorClass: 'text-amber-600', bgClass: 'bg-amber-50' }
  return { label: '低优', colorClass: 'text-slate-500', bgClass: 'bg-slate-50' }
}

/**
 * Get deadline countdown string
 * Returns e.g. "3天后截止", "今日截止", "已截止", "无截止日期"
 */
export function getDeadlineCountdown(deadlineAt?: string): {
  text: string
  isUrgent: boolean   // true if <= 7 days
  isOverdue: boolean  // true if past deadline
} {
  if (!deadlineAt) return { text: '无截止日期', isUrgent: false, isOverdue: false }
  const daysLeft = Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 86400000)
  if (daysLeft < 0) return { text: '已截止', isUrgent: true, isOverdue: true }
  if (daysLeft === 0) return { text: '今日截止', isUrgent: true, isOverdue: false }
  return {
    text: `${daysLeft}天后截止`,
    isUrgent: daysLeft <= 7,
    isOverdue: false,
  }
}
