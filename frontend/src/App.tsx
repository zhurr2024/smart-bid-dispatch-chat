import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import BidsPage from '@/pages/BidsPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'

const ChatPage = lazy(() => import('@/pages/ChatPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RoleGuard({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user || !roles.includes(user.role)) return <Navigate to="/bids" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/smart-bid-dispatch-chat">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/bids" replace />} />
            <Route path="bids" element={<BidsPage />} />
            <Route
              path="chat"
              element={
                <RoleGuard roles={['HQ_OPS']}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full">加载中...</div>}>
                    <ChatPage />
                  </Suspense>
                </RoleGuard>
              }
            />
            <Route path="reports" element={<ReportsPage />} />
            <Route
              path="settings"
              element={
                <RoleGuard roles={['HQ_OPS']}>
                  <SettingsPage />
                </RoleGuard>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/bids" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
