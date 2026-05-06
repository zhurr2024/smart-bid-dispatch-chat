import { http, HttpResponse } from 'msw'
import { mockBids } from '../data/bids'

export const reportHandlers = [
  http.get('/api/v1/reports/overview', () => {
    const total = mockBids.length
    const high = mockBids.filter(b => b.priority === 'HIGH').length
    const completed = mockBids.filter(b => b.status === 'COMPLETED').length
    const closed = mockBids.filter(b => ['OPPORTUNITY', 'NO_OPPORTUNITY', 'COMPLETED'].includes(b.status)).length
    const pending = mockBids.filter(b => b.status === 'PENDING').length
    return HttpResponse.json({
      totalBids: total,
      highPriorityBids: high,
      avgResponseHours: 18.5,
      conversionRate: closed > 0 ? Math.round((completed / closed) * 100) : 0,
      pendingBids: pending,
      wonBids: completed,
      intentBids: mockBids.filter(b => b.tenderType === 'INTENT').length,
      formalBids: mockBids.filter(b => b.tenderType === 'FORMAL').length,
    })
  }),

  http.get('/api/v1/reports/trend', () => {
    return HttpResponse.json([
      { month: '2023-10', intent: 8, formal: 12, total: 20 },
      { month: '2023-11', intent: 10, formal: 15, total: 25 },
      { month: '2023-12', intent: 12, formal: 18, total: 30 },
      { month: '2024-01', intent: 9, formal: 16, total: 25 },
      { month: '2024-02', intent: 11, formal: 14, total: 25 },
      { month: '2024-03', intent: 10, formal: 10, total: 20 },
    ])
  }),

  http.get('/api/v1/reports/region-dist', () => {
    const regions = ['华南', '华东', '华北', '西南', '华中']
    return HttpResponse.json(
      regions.map(region => ({
        region,
        count: mockBids.filter(b => b.region === region).length,
        won: mockBids.filter(b => b.region === region && b.status === 'COMPLETED').length,
      }))
    )
  }),

  http.get('/api/v1/reports/winloss-funnel', () => {
    return HttpResponse.json([
      { stage: '标讯总量', count: mockBids.length },
      { stage: '已分配', count: mockBids.filter(b => b.status !== 'PENDING').length },
      { stage: '跟进中', count: mockBids.filter(b => ['IN_PROGRESS', 'OPPORTUNITY', 'NO_OPPORTUNITY', 'COMPLETED'].includes(b.status)).length },
      { stage: '有商机', count: mockBids.filter(b => ['OPPORTUNITY', 'COMPLETED'].includes(b.status)).length },
      { stage: '完成', count: mockBids.filter(b => b.status === 'COMPLETED').length },
    ])
  }),
]
