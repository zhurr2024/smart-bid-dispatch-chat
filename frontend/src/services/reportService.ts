import api from './api'
import { ReportOverview, TrendData, RegionData, FunnelData } from '@/types'

export const reportService = {
  overview: () =>
    api.get<ReportOverview>('/reports/overview').then(r => r.data),
  trend: () =>
    api.get<TrendData[]>('/reports/trend').then(r => r.data),
  regionDist: () =>
    api.get<RegionData[]>('/reports/region-dist').then(r => r.data),
  winlossFunnel: () =>
    api.get<FunnelData[]>('/reports/winloss-funnel').then(r => r.data),
}
