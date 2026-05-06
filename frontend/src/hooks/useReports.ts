import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'

export const useReportOverview = () =>
  useQuery({ queryKey: ['report-overview'], queryFn: reportService.overview })

export const useReportTrend = () =>
  useQuery({ queryKey: ['report-trend'], queryFn: reportService.trend })

export const useReportRegion = () =>
  useQuery({ queryKey: ['report-region'], queryFn: reportService.regionDist })

export const useReportFunnel = () =>
  useQuery({ queryKey: ['report-funnel'], queryFn: reportService.winlossFunnel })
