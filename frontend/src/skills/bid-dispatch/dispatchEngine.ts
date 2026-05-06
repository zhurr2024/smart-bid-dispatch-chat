import { Bid, User } from '@/types'

/**
 * 自动分配逻辑：根据大区匹配最合适的AR
 */
export function autoDispatch(bid: Bid, users: User[]): User | null {
  const arList = users.filter(u => u.role === 'AR' && u.isActive)

  // 优先同大区AR
  const sameRegion = arList.filter(u => u.region === bid.region)
  if (sameRegion.length > 0) {
    // 简单轮询：选第一个（实际应基于工作量负载）
    return sameRegion[0]
  }

  // 如无同大区AR，返回任意AR
  return arList[0] || null
}

/**
 * Return top N suggested ARs for a bid, with a reason string and score
 */
export function suggestDispatch(
  bid: Bid,
  users: User[],
  topN = 3
): Array<{ user: User; reason: string; score: number }> {
  const arList = users.filter(u => u.role === 'AR' && u.isActive)

  const scored = arList.map(user => {
    let score = 5 // baseline
    let reason = '全国通用'

    const sameRegion = user.region && bid.region && user.region === bid.region
    const sameTeam = user.team && bid.region && user.team === bid.region

    if (sameRegion) {
      score += 30
      reason = `同大区 · ${user.region}`
    } else if (sameTeam) {
      score += 10
      reason = `同团队 · ${user.team}`
    }

    return { user, reason, score }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, topN)
}

/**
 * 检查高优标讯是否超时未响应（超过N小时）
 */
export function isOverdue(bid: Bid, hours = 24): boolean {
  if (bid.priority !== 'HIGH') return false
  if (bid.status !== 'ASSIGNED') return false
  const assignedTime = new Date(bid.updatedAt).getTime()
  return Date.now() - assignedTime > hours * 3600 * 1000
}
