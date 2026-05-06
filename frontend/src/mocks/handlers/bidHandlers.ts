import { http, HttpResponse } from 'msw'
import { mockBids } from '../data/bids'
import { mockTracks } from '../data/tracks'
import { mockUsers } from '../data/users'
import { Bid, BidStatus, TrackRecord } from '@/types'

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
    const region = url.searchParams.get('region')
    const search = url.searchParams.get('search')
    const assignedTo = url.searchParams.get('assignedTo')

    let filtered = [...bids]
    if (priority) filtered = filtered.filter(b => b.priority === priority)
    if (status) filtered = filtered.filter(b => b.status === status)
    if (bidType) filtered = filtered.filter(b => b.bidType === bidType)
    if (region) filtered = filtered.filter(b => b.region === region)
    if (assignedTo) filtered = filtered.filter(b => b.assignedTo === assignedTo)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(b =>
        b.projectName.toLowerCase().includes(q) ||
        b.purchaserName.toLowerCase().includes(q) ||
        b.bidNo.toLowerCase().includes(q)
      )
    }

    const total = filtered.length
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)
    return HttpResponse.json({ data, total, page, pageSize })
  }),

  http.get('/api/v1/bids/:id', ({ params }) => {
    const bid = bids.find(b => b.id === params.id)
    if (!bid) return HttpResponse.json({ message: '标讯不存在' }, { status: 404 })
    return HttpResponse.json(bid)
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
    // Add track record
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
]

const statusActionMap: Partial<Record<BidStatus, string>> = {
  RECEIVED: '确认接收',
  IN_PROGRESS: '开始跟进',
  OPPORTUNITY: '商机上报',
  WON: '赢单确认',
  LOST: '输单确认',
  ABANDONED: '标记放弃',
}
