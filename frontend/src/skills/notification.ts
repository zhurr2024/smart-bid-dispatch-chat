import { Bid } from '@/types'

export interface AlertItem {
  id: string
  type: 'OVERDUE_HIGH' | 'DEADLINE_SOON' | 'UNREAD_BATCH'
  bidId?: string
  title: string
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  createdAt: string
}

const SEVERITY_ORDER: Record<AlertItem['severity'], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

/**
 * Scan bids for overdue high-priority items (HIGH priority, ASSIGNED, > hoursThreshold hours old)
 */
export function scanOverdueHighPriority(bids: Bid[], hoursThreshold = 24): AlertItem[] {
  const now = Date.now()
  const thresholdMs = hoursThreshold * 60 * 60 * 1000

  return bids
    .filter(bid => {
      if (bid.priority !== 'HIGH' || bid.status !== 'ASSIGNED') return false
      const updatedMs = new Date(bid.updatedAt).getTime()
      return now - updatedMs > thresholdMs
    })
    .map(bid => ({
      id: `OVERDUE_HIGH::${bid.id}`,
      type: 'OVERDUE_HIGH' as const,
      bidId: bid.id,
      title: '高优标讯逾期未响应',
      message: `标讯「${bid.projectName}」已超 ${hoursThreshold} 小时未更新，请及时跟进。`,
      severity: 'HIGH' as const,
      createdAt: new Date().toISOString(),
    }))
}

/**
 * Scan bids for upcoming deadlines (deadline within daysThreshold days)
 */
export function scanUpcomingDeadlines(bids: Bid[], daysThreshold = 3): AlertItem[] {
  const now = Date.now()
  const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000

  return bids
    .filter(bid => {
      if (!bid.deadlineAt) return false
      const deadlineMs = new Date(bid.deadlineAt).getTime()
      const diff = deadlineMs - now
      return diff > 0 && diff <= thresholdMs
    })
    .map(bid => {
      const deadlineMs = new Date(bid.deadlineAt!).getTime()
      const hoursLeft = Math.ceil((deadlineMs - now) / (60 * 60 * 1000))
      return {
        id: `DEADLINE_SOON::${bid.id}`,
        type: 'DEADLINE_SOON' as const,
        bidId: bid.id,
        title: '截止日期临近',
        message: `标讯「${bid.projectName}」将在 ${hoursLeft} 小时后截止，请尽快处理。`,
        severity: 'MEDIUM' as const,
        createdAt: new Date().toISOString(),
      }
    })
}

/**
 * Generate a batch unread alert if there are many pending bids
 */
export function checkUnreadBatch(bids: Bid[], threshold = 10): AlertItem | null {
  const pendingCount = bids.filter(bid => bid.status === 'PENDING').length
  if (pendingCount <= threshold) return null

  return {
    id: 'UNREAD_BATCH::global',
    type: 'UNREAD_BATCH',
    title: '大量待处理标讯',
    message: `当前有 ${pendingCount} 条标讯处于待处理状态，建议及时分配或跟进。`,
    severity: 'LOW',
    createdAt: new Date().toISOString(),
  }
}

/**
 * Run all checks and return merged, deduplicated alerts sorted by severity
 */
export function runAlertChecks(bids: Bid[]): AlertItem[] {
  const overdue = scanOverdueHighPriority(bids)
  const deadlines = scanUpcomingDeadlines(bids)
  const batch = checkUnreadBatch(bids)

  const all: AlertItem[] = [...overdue, ...deadlines]
  if (batch) all.push(batch)

  const seen = new Set<string>()
  const deduped = all.filter(alert => {
    if (seen.has(alert.id)) return false
    seen.add(alert.id)
    return true
  })

  return deduped.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
