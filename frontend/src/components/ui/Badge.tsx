import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  color?: 'red' | 'amber' | 'green' | 'indigo' | 'sky' | 'slate' | 'emerald' | 'purple'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'slate', className }) => {
  const colors = {
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border', colors[color], className)}>
      {children}
    </span>
  )
}
