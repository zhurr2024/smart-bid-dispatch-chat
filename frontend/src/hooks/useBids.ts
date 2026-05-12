import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bidService, BidQuery } from '@/services/bidService'
import { BidStatus } from '@/types'
import { useAuthStore } from '@/stores/authStore'

export const useBids = (params: BidQuery) =>
  useQuery({
    queryKey: ['bids', params],
    queryFn: () => bidService.list(params),
  })

export const useBid = (id: string | null) =>
  useQuery({
    queryKey: ['bid', id],
    queryFn: () => bidService.get(id!),
    enabled: !!id,
  })

export const useBidTracks = (id: string | null) =>
  useQuery({
    queryKey: ['bid-tracks', id],
    queryFn: () => bidService.getTracks(id!),
    enabled: !!id,
  })

export const useAssignBid = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      bidService.assign(id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids'] })
      qc.invalidateQueries({ queryKey: ['bid'] })
    },
  })
}

export const useUpdateBidStatus = () => {
  const qc = useQueryClient()
  const user = useAuthStore(s => s.user)
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: BidStatus; note?: string }) =>
      bidService.updateStatus(id, {
        status,
        note,
        userId: user!.id,
        userName: user!.name,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids'] })
      qc.invalidateQueries({ queryKey: ['bid'] })
      qc.invalidateQueries({ queryKey: ['bid-tracks'] })
    },
  })
}

export const useMarkBidRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bidService.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids'] })
      qc.invalidateQueries({ queryKey: ['bid'] })
    },
  })
}

export const useExportBids = () => {
  return useMutation({
    mutationFn: (params: BidQuery) => bidService.exportBids(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `标讯数据_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  })
}

export const useDispatchBids = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => bidService.dispatchBids(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids'] })
      qc.invalidateQueries({ queryKey: ['bid'] })
    },
  })
}

export const useBatchAssignBids = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, itcode }: { ids: string[]; itcode: string }) =>
      bidService.batchAssign(ids, itcode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids'] })
      qc.invalidateQueries({ queryKey: ['bid'] })
    },
  })
}
