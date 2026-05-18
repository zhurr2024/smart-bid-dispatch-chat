import React from 'react'
import { useUiStore } from '@/stores/uiStore'

export default function SettingsPage() {
  const chatEnabled = useUiStore(s => s.chatEnabled)
  const setChatEnabled = useUiStore(s => s.setChatEnabled)

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-semibold text-[var(--text-1)] text-lg mb-1">系统设置</h1>
      <p className="text-sm text-[var(--text-3)] mb-6">管理系统功能开关和配置</p>

      <div className="bg-white rounded-[8px] border border-[var(--border-2)] shadow-card divide-y divide-[var(--border-1)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm font-medium text-[var(--text-1)]">智能问答功能</div>
            <div className="text-xs text-[var(--text-3)] mt-0.5">开启后，运营总部可通过对话方式上传标讯和查询标讯</div>
          </div>
          <button
            onClick={() => setChatEnabled(!chatEnabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              chatEnabled ? 'bg-[var(--brand-6)]' : 'bg-[var(--fill-3)]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                chatEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
