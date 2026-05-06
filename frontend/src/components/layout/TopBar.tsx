import React from 'react'
import { Bell, Menu, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'

export const TopBar: React.FC = () => {
  const user = useAuthStore(s => s.user)
  const toggle = useUiStore(s => s.toggleSidebar)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0 z-10">
      <button onClick={toggle} className="text-slate-500 hover:text-slate-700 cursor-pointer transition-colors p-1 rounded-md hover:bg-slate-100">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 text-slate-900">
        <div className="w-6 h-6 bg-indigo-700 rounded flex items-center justify-center">
          <ChevronRight size={12} className="text-white" />
        </div>
        <span className="font-semibold text-sm">智能标讯分发系统</span>
      </div>

      <div className="flex-1" />

      <button className="relative text-slate-500 hover:text-slate-700 cursor-pointer p-2 rounded-md hover:bg-slate-100 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
          {user?.name?.[0] || '?'}
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-slate-900">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.region || '总部'}</div>
        </div>
      </div>
    </header>
  )
}
