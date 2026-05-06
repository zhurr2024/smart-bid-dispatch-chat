import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface StatusMessageProps {
  userName: string
  action: string
  bidName: string
  time: string
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ userName, action, bidName, time }) => (
  <div className="flex justify-center py-1">
    <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 text-xs text-slate-500">
      <CheckCircle2 size={12} className="text-emerald-500" />
      <span>
        <span className="font-medium text-slate-700">{userName}</span> {action}「{bidName}」· {time}
      </span>
    </div>
  </div>
)
