import { http, HttpResponse } from 'msw'
import { mockOpportunities } from '../data/opportunities'
import { Opportunity } from '@/types'

let opportunities: Opportunity[] = [...mockOpportunities]

export const opportunityHandlers = [
  http.get('/api/v1/opportunities', ({ request }) => {
    const url = new URL(request.url)
    const bidId = url.searchParams.get('bidId')
    const arUserId = url.searchParams.get('arUserId')
    let filtered = [...opportunities]
    if (bidId) filtered = filtered.filter(o => o.bidId === bidId)
    if (arUserId) filtered = filtered.filter(o => o.arUserId === arUserId)
    return HttpResponse.json(filtered)
  }),

  http.post('/api/v1/opportunities', async ({ request }) => {
    const body = await request.json() as Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>
    const opp: Opportunity = {
      ...body,
      id: 'opp-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    opportunities.push(opp)
    return HttpResponse.json(opp)
  }),

  http.put('/api/v1/opportunities/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<Opportunity>
    const idx = opportunities.findIndex(o => o.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: '商机不存在' }, { status: 404 })
    opportunities[idx] = { ...opportunities[idx], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json(opportunities[idx])
  }),
]
