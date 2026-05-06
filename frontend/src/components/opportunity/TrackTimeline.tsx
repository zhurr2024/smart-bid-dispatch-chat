import React from 'react'
import { TrackRecord } from '@/types'
import { BID_STATUS_LABELS } from '@/skills/bid-analysis/priorityEngine'
import clsx from 'clsx'

const statusColor: Record<string, string> = {
  PENDING: 'bg-slate-300',
  ASSIGNED: 'bg-blue-400',
  RECEIVED: 'bg-sky-500',
  IN_PROGRESS: 'bg-indigo-500',
  OPPORTUNITY: 'bg-purple-500',
  WON: 'bg-emerald-500',
  LOST: 'bg-red-400',
  ABANDONED: 'bg-slate-300',
}

export const TrackTimeline: React.FC<{ tracks: TrackRecord[] }> = ({ tracks }) => {
  if (!tracks.length) {
    return <div className="text-xs text-slate-400 text-center py-4">暂无跟进记录</div>
  }

  const sorted = [...tracks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return (
    <div className="space-y-0">
      {sorted.map((track, idx) => (
        <div key={track.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={clsx('w-3 h-3 rounded-full flex-shrink-0 mt-1', statusColor[track.status] || 'bg-slate-300')} />
            {idx < sorted.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
          </div>
          <div className={clsx('pb-4', idx === sorted.length - 1 && 'pb-0')}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-900">{track.userName}</span>
              <span className="text-xs text-slate-500">{track.action}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {BID_STATUS_LABELS[track.status] || track.status}
              </span>
            </div>
            {track.note && (
              <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded px-2 py-1.5">{track.note}</p>
            )}
            <div className="text-xs text-slate-400 mt-1">
              {new Date(track.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
