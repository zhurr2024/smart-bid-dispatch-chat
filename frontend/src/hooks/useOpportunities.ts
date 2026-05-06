import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { opportunityService } from '@/services/opportunityService'
import { Opportunity } from '@/types'

export const useOpportunities = (params?: { bidId?: string; arUserId?: string }) =>
  useQuery({
    queryKey: ['opportunities', params],
    queryFn: () => opportunityService.list(params),
  })

export const useCreateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) =>
      opportunityService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  })
}

export const useUpdateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Opportunity> & { id: string }) =>
      opportunityService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  })
}
