import React from 'react'
import { AlertItem } from '@/skills/notification'

interface AlertMessageProps {
  alert: AlertItem
  onDismiss?: () => void
}

const CONFIG = {
  HIGH: {
    wrapper: 'bg-red-50 border border-red-300 text-red-800',
    icon: '🚨',
  },
  MEDIUM: {
    wrapper: 'bg-amber-50 border border-amber-300 text-amber-800',
    icon: '⚠️',
  },
  LOW: {
    wrapper: 'bg-blue-50 border border-blue-300 text-blue-800',
    icon: 'ℹ️',
  },
} as const

export const AlertMessage: React.FC<AlertMessageProps> = ({ alert, onDismiss }) => {
  const cfg = CONFIG[alert.severity]
  const formattedTime = new Date(alert.createdAt).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${cfg.wrapper}`}>
      <span className="flex-shrink-0 text-base leading-5">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-5">{alert.title}</p>
        <p className="mt-0.5 leading-5">{alert.message}</p>
        <p className="mt-1 text-xs opacity-60">{formattedTime}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-1 opacity-50 hover:opacity-100 transition-opacity leading-5 cursor-pointer"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
