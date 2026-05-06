import { Opportunity } from '@/types'

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    bidId: 'bid-004',
    arUserId: 'user-ar-001',
    opportunityName: '广深高速公路智能运维管理平台',
    estimatedAmount: 600,
    estimatedCloseDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    competitors: ['华为', '中兴'],
    stage: 'SOLUTION_DISCUSS',
    notes: '客户对我方方案较感兴趣，已完成初步需求调研，正在准备详细技术方案。',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'opp-002',
    bidId: 'bid-005',
    arUserId: 'user-ar-002',
    opportunityName: '南方电网调度自动化系统升级',
    estimatedAmount: 4500,
    estimatedCloseDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    competitors: ['IBM', '联想'],
    stage: 'SIGNING',
    notes: '已完成合同谈判，即将签署合同。',
    result: 'WON',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]
