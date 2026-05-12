import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Upload, BarChart2, Settings,
  LogOut, ChevronRight, Clock, MessageSquare
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { useBids } from '@/hooks/useBids'

export const Sidebar: React.FC = () => {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const collapsed = useUiStore(s => s.sidebarCollapsed)
  const chatEnabled = useUiStore(s => s.chatEnabled)
  const navigate = useNavigate()

  const { data: pendingData } = useBids({ status: 'PENDING', pageSize: 100 })
  const pendingCount = pendingData?.total || 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/bids', icon: FileText, label: '标讯管理', roles: null },
    {
      to: '/chat', icon: MessageSquare, label: '智能问答',
      roles: ['HQ_OPS'],
      featureFlag: 'chat' as const,
    },
    { to: '/reports', icon: BarChart2, label: '数据报表', roles: ['HQ_OPS', 'SALES_ADMIN', 'TEAM_LEADER'] },
    { to: '/settings', icon: Settings, label: '系统设置', roles: ['HQ_OPS'] },
  ]

  const visible = navItems.filter(item => {
    if (item.roles && (!user || !item.roles.includes(user.role))) return false
    if (item.featureFlag === 'chat' && !chatEnabled) return false
    return true
  })

  return (
    <aside className={clsx(
      'flex flex-col bg-white border-r border-slate-200 transition-all duration-200 flex-shrink-0',
      collapsed ? 'w-14' : 'w-60'
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-200 gap-3">
        <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <ChevronRight size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-slate-900 text-sm leading-tight">
            智能标讯<br />分发系统
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {visible.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 flex items-center justify-between">
                {item.label}
                {item.to === '/bids' && pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 text-sm font-semibold">
            {user?.name?.[0] || '?'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 truncate">{roleLabel[user?.role || '']}</div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" title="退出">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

const roleLabel: Record<string, string> = {
  HQ_OPS: '运营总部',
  TEAM_LEADER: '纵队Leader',
  SALES_ADMIN: '销管',
  AR: '客户经理',
  PRODUCT_MGR: '产品经理',
}
