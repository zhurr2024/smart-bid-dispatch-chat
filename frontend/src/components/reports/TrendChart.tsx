import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendData } from '@/types'

export const TrendChart: React.FC<{ data: TrendData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Line type="monotone" dataKey="intent" name="意向招标" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
      <Line type="monotone" dataKey="formal" name="实时招标" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
      <Line type="monotone" dataKey="total" name="合计" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
    </LineChart>
  </ResponsiveContainer>
)
