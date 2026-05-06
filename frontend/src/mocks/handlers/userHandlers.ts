import { http, HttpResponse } from 'msw'
import { mockUsers } from '../data/users'

export const userHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    const user = mockUsers.find(u => u.email === body.email)
    if (!user) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 401 })
    }
    return HttpResponse.json({ user, token: 'mock-token-' + user.id })
  }),

  http.get('/api/v1/users', ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const region = url.searchParams.get('region')
    let users = [...mockUsers]
    if (role) users = users.filter(u => u.role === role)
    if (region) users = users.filter(u => u.region === region)
    return HttpResponse.json(users)
  }),

  http.get('/api/v1/users/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) return HttpResponse.json({ message: '未授权' }, { status: 401 })
    const userId = auth.replace('Bearer mock-token-', '')
    const user = mockUsers.find(u => u.id === userId)
    if (!user) return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    return HttpResponse.json(user)
  }),
]
