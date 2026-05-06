import api from './api'
import { Bid, BidStatus, ListResponse } from '@/types'

export interface BidQuery {
  page?: number
  pageSize?: number
  priority?: string
  status?: string
  bidType?: string
  region?: string
  search?: string
  assignedTo?: string
}

export const bidService = {
  list: (params: BidQuery) =>
    api.get<ListResponse<Bid>>('/bids', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Bid>(`/bids/${id}`).then(r => r.data),

  assign: (id: string, userId: string) =>
    api.put<Bid>(`/bids/${id}/assign`, { userId }).then(r => r.data),

  updateStatus: (id: string, payload: { status: BidStatus; note?: string; userId: string; userName: string }) =>
    api.put<Bid>(`/bids/${id}/status`, payload).then(r => r.data),

  getTracks: (id: string) =>
    api.get(`/bids/${id}/tracks`).then(r => r.data),

  addTrack: (id: string, payload: object) =>
    api.post(`/bids/${id}/tracks`, payload).then(r => r.data),
}
