import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { FunnelData } from '@/types'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

export const FunnelChart: React.FC<{ data: FunnelData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
      <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
      <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
      <Tooltip
        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
        formatter={(v: number) => [`${v} 条`, '数量']}
      />
      <Bar dataKey="count" name="数量" radius={[0, 4, 4, 0]}>
        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)
