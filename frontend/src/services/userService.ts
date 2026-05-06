import api from './api'
import { User } from '@/types'

export const userService = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password }).then(r => r.data),

  list: (params?: { role?: string; region?: string }) =>
    api.get<User[]>('/users', { params }).then(r => r.data),

  me: () =>
    api.get<User>('/users/me').then(r => r.data),
}
