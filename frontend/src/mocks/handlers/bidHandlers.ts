import { http, HttpResponse } from 'msw'
import { mockBids } from '../data/bids'
import { mockTracks } from '../data/tracks'
import { mockUsers } from '../data/users'
import { Bid, BidStatus, TrackRecord } from '@/types'
import { matchBidToProducts, filterBidsForProductManager } from '@/skills/product-matching/productEngine'

// In-memory mutable state
let bids: Bid[] = [...mockBids]
let tracks: TrackRecord[] = [...mockTracks]

export const bidHandlers = [
  http.get('/api/v1/bids', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const priority = url.searchParams.get('priority')
    const status = url.searchParams.get('status')
    const bidType = url.searchParams.get('bidType')
    const tenderType = url.searchParams.get('tenderType')
    const region = url.searchParams.get('region')
    const industry = url.searchParams.get('industry')
    const search = url.searchParams.get('search')
    const assignedTo = url.searchParams.get('assignedTo')
    const opportunityNo = url.searchParams.get('opportunityNo')
    const productManagerId = url.searchParams.get('productManagerId')
    const productName = url.searchParams.get('productName')

    let filtered = [...bids]

    // If PM filter, only show bids matching their products
    if (productManagerId) {
      filtered = filterBidsForProductManager(filtered, productManagerId)
    }

    // Filter by specific product name
    if (productName) {
      filtered = filtered.filter(b => {
        const matched = matchBidToProducts(b)
        return matched.some(mp => mp.productName === productName)
      })
    }

    if (priority) filtered = filtered.filter(b => b.priority === priority)
    if (status) filtered = filtered.filter(b => b.status === status)
    if (bidType) filtered = filtered.filter(b => b.bidType === bidType)
    if (tenderType) filtered = filtered.filter(b => b.tenderType === tenderType)
    if (region) filtered = filtered.filter(b => b.region === region)
    if (industry) filtered = filtered.filter(b => b.industry === industry)
    if (assignedTo) filtered = filtered.filter(b => b.assignedTo === assignedTo)
    if (opportunityNo) {
      const q = opportunityNo.toLowerCase()
      filtered = filtered.filter(b => b.opportunityNo?.toLowerCase().includes(q))
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(b =>
        b.projectName.toLowerCase().includes(q) ||
        b.purchaserName.toLowerCase().includes(q) ||
        b.bidNo.toLowerCase().includes(q)
      )
    }

    const total = filtered.length
    const sliced = filtered.slice((page - 1) * pageSize, page * pageSize)
    // Enrich with matchedProducts
    const data = sliced.map(b => ({
      ...b,
      matchedProducts: matchBidToProducts(b),
    }))
    return HttpResponse.json({ data, total, page, pageSize })
  }),

  http.get('/api/v1/bids/export', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const bidType = url.searchParams.get('bidType')
    const tenderType = url.searchParams.get('tenderType')
    const region = url.searchParams.get('region')
    const search = url.searchParams.get('search')

    let filtered = [...bids]
    if (status) filtered = filtered.filter(b => b.status === status)
    if (bidType) filtered = filtered.filter(b => b.bidType === bidType)
    if (tenderType) filtered = filtered.filter(b => b.tenderType === tenderType)
    if (region) filtered = filtered.filter(b => b.region === region)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(b =>
        b.projectName.toLowerCase().includes(q) ||
        b.purchaserName.toLowerCase().includes(q) ||
        b.bidNo.toLowerCase().includes(q)
      )
    }

    // Generate CSV content
    const headers = ['标讯编号', '标讯类型', '招标类型', '项目名称', '采购单位', '项目地点', '战区', '预算金额(万)', '状态', '采购开始时间', '采购截止时间']
    const rows = filtered.map(b => [
      b.bidNo, b.bidType, b.tenderType === 'INTENT' ? '意向招标' : '实时招标',
      b.projectName, b.purchaserName, b.location, b.region,
      b.budget?.toString() || '', statusLabelMap[b.status] || b.status,
      b.publishedAt.slice(0, 10), b.deadlineAt?.slice(0, 10) || ''
    ])
    const csv = '\uFEFF' + [headers, ...rows].map(r => r.join(',')).join('\n')
    return new HttpResponse(csv, {
      headers: { 'Content-Type': 'text/csv;charset=utf-8', 'Content-Disposition': 'attachment; filename=bids.csv' },
    })
  }),

  http.get('/api/v1/bids/:id', ({ params }) => {
    const bid = bids.find(b => b.id === params.id)
    if (!bid) return HttpResponse.json({ message: '标讯不存在' }, { status: 404 })
    const enriched = { ...bid, matchedProducts: matchBidToProducts(bid) }
    return HttpResponse.json(enriched)
  }),

  http.put('/api/v1/bids/:id/read', ({ params }) => {
    const idx = bids.findIndex(b => b.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: '标讯不存在' }, { status: 404 })
    bids[idx] = { ...bids[idx], isRead: true, updatedAt: new Date().toISOString() }
    return HttpResponse.json(bids[idx])
  }),

  http.put('/api/v1/bids/:id/assign', async ({ params, request }) => {
    const body = await request.json() as { userId: string }
    const idx = bids.findIndex(b => b.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: '标讯不存在' }, { status: 404 })
    const assignedUser = mockUsers.find(u => u.id === body.userId)
    bids[idx] = {
      ...bids[idx],
      assignedTo: body.userId,
      assignedToUser: assignedUser,
      status: 'ASSIGNED',
      updatedAt: new Date().toISOString(),
    }
    tracks.push({
      id: 'track-' + Date.now(),
      bidId: bids[idx].id,
      userId: body.userId,
      userName: assignedUser?.name || '系统',
      action: '分配标讯',
      status: 'ASSIGNED',
      createdAt: new Date().toISOString(),
    })
    return HttpResponse.json(bids[idx])
  }),

  http.put('/api/v1/bids/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: BidStatus; note?: string; userId: string; userName: string }
    const idx = bids.findIndex(b => b.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: '标讯不存在' }, { status: 404 })
    bids[idx] = { ...bids[idx], status: body.status, updatedAt: new Date().toISOString() }
    tracks.push({
      id: 'track-' + Date.now(),
      bidId: bids[idx].id,
      userId: body.userId,
      userName: body.userName,
      action: statusActionMap[body.status] || body.status,
      status: body.status,
      note: body.note,
      createdAt: new Date().toISOString(),
    })
    return HttpResponse.json(bids[idx])
  }),

  http.get('/api/v1/bids/:id/tracks', ({ params }) => {
    const bidTracks = tracks.filter(t => t.bidId === params.id)
    return HttpResponse.json(bidTracks)
  }),

  http.post('/api/v1/bids/:id/tracks', async ({ params, request }) => {
    const body = await request.json() as Omit<TrackRecord, 'id' | 'bidId' | 'createdAt'>
    const track: TrackRecord = {
      ...body,
      id: 'track-' + Date.now(),
      bidId: params.id as string,
      createdAt: new Date().toISOString(),
    }
    tracks.push(track)
    return HttpResponse.json(track)
  }),

  // PUT /api/v1/bids/dispatch — batch dispatch (HQ_OPS)
  http.put('/api/v1/bids/dispatch', async ({ request }) => {
    const body = await request.json() as { ids: string[] }
    const results: Bid[] = []
    for (const id of body.ids) {
      const idx = bids.findIndex(b => b.id === id)
      if (idx === -1) continue
      // Simulate auto-dispatch: if bid has a region match, mark ASSIGNED; otherwise PENDING
      const hasAutoMatch = bids[idx].assignedTo != null
      bids[idx] = {
        ...bids[idx],
        status: hasAutoMatch ? 'ASSIGNED' : 'PENDING',
        updatedAt: new Date().toISOString(),
      }
      tracks.push({
        id: 'track-' + Date.now() + '-' + id,
        bidId: id,
        userId: 'system',
        userName: '系统',
        action: hasAutoMatch ? '自动分配成功' : '下发待分配',
        status: bids[idx].status,
        createdAt: new Date().toISOString(),
      })
      results.push(bids[idx])
    }
    return HttpResponse.json({ data: results, count: results.length })
  }),

  // PUT /api/v1/bids/batch-assign — batch assign by itcode (SALES_ADMIN)
  http.put('/api/v1/bids/batch-assign', async ({ request }) => {
    const body = await request.json() as { ids: string[]; itcode: string }
    const results: Bid[] = []
    for (const id of body.ids) {
      const idx = bids.findIndex(b => b.id === id)
      if (idx === -1) continue
      bids[idx] = {
        ...bids[idx],
        assignedTo: body.itcode,
        status: 'ASSIGNED',
        updatedAt: new Date().toISOString(),
      }
      tracks.push({
        id: 'track-' + Date.now() + '-' + id,
        bidId: id,
        userId: body.itcode,
        userName: body.itcode,
        action: '手工分配标讯',
        status: 'ASSIGNED',
        createdAt: new Date().toISOString(),
      })
      results.push(bids[idx])
    }
    return HttpResponse.json({ data: results, count: results.length })
  }),
]

const statusActionMap: Partial<Record<BidStatus, string>> = {
  IN_PROGRESS: '跟进中',
  OPPORTUNITY: '已创建商机',
  NO_OPPORTUNITY: '无商机',
  LINKED_OPPORTUNITY: '已关联商机',
  COMPLETED: '完成',
}

const statusLabelMap: Record<string, string> = {
  UPLOADED: '已上传',
  PENDING: '待分配',
  ASSIGNED: '已分配',
  IN_PROGRESS: '跟进中',
  OPPORTUNITY: '已创建商机',
  NO_OPPORTUNITY: '无商机',
  LINKED_OPPORTUNITY: '已关联商机',
  COMPLETED: '完成',
}
