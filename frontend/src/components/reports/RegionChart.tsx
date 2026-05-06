import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { RegionData } from '@/types'

export const RegionChart: React.FC<{ data: RegionData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#94a3b8' }} />
      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Bar dataKey="count" name="标讯总量" fill="#6366f1" radius={[4, 4, 0, 0]} />
      <Bar dataKey="won" name="赢单数" fill="#10b981" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)
