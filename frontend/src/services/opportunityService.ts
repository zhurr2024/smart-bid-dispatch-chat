import api from './api'
import { Opportunity } from '@/types'

export const opportunityService = {
  list: (params?: { bidId?: string; arUserId?: string }) =>
    api.get<Opportunity[]>('/opportunities', { params }).then(r => r.data),

  create: (payload: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Opportunity>('/opportunities', payload).then(r => r.data),

  update: (id: string, payload: Partial<Opportunity>) =>
    api.put<Opportunity>(`/opportunities/${id}`, payload).then(r => r.data),
}
