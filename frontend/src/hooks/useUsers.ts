import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'

export const useUsers = (params?: { role?: string; region?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.list(params),
  })
