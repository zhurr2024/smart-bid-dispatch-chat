import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Priority } from '@/types'

const config: Record<Priority, { label: string; color: 'red' | 'amber' | 'slate'; border: string }> = {
  HIGH: { label: '高', color: 'red', border: 'border-l-red-500' },
  MEDIUM: { label: '中', color: 'amber', border: 'border-l-amber-500' },
  LOW: { label: '低', color: 'slate', border: 'border-l-slate-300' },
}

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const c = config[priority]
  return <Badge color={c.color}>{c.label}优先级</Badge>
}

export const priorityBorderClass = (priority: Priority) => config[priority].border
