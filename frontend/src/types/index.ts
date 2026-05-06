export type UserRole = 'HQ_OPS' | 'TEAM_LEADER' | 'SALES_ADMIN' | 'REGION_LEADER' | 'AR'
export type BidType = 'ISG' | 'SSG'
export type TenderType = 'INTENT' | 'FORMAL'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type BidStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'OPPORTUNITY'
  | 'WON'
  | 'LOST'
  | 'ABANDONED'
export type OpportunityStage =
  | 'INITIAL_CONTACT'
  | 'SOLUTION_DISCUSS'
  | 'QUOTATION'
  | 'APPROVAL'
  | 'SIGNING'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  region?: string
  team?: string
  avatar?: string
  isActive: boolean
}

export interface Bid {
  id: string
  bidNo: string
  bidType: BidType
  tenderType: TenderType
  projectName: string
  purchaserName: string
  location: string
  region: string
  budget?: number
  publishedAt: string
  deadlineAt?: string
  summary: string
  keywords?: string[]
  source?: string
  priority: Priority
  status: BidStatus
  assignedTo?: string
  assignedToUser?: User
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TrackRecord {
  id: string
  bidId: string
  userId: string
  userName: string
  action: string
  status: BidStatus
  note?: string
  createdAt: string
}

export interface Opportunity {
  id: string
  bidId: string
  arUserId: string
  opportunityName: string
  estimatedAmount?: number
  estimatedCloseDate?: string
  competitors?: string[]
  stage: OpportunityStage
  notes?: string
  result?: 'WON' | 'LOST' | 'ABANDONED'
  lostReason?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  type: 'BID_PUSH' | 'STATUS_UPDATE' | 'ALERT' | 'SYSTEM'
  bidId?: string
  bid?: Bid
  content: string
  createdAt: string
}

export interface ReportOverview {
  totalBids: number
  highPriorityBids: number
  avgResponseHours: number
  conversionRate: number
  pendingBids: number
  wonBids: number
  intentBids: number
  formalBids: number
}

export interface TrendData {
  month: string
  intent: number
  formal: number
  total: number
}

export interface RegionData {
  region: string
  count: number
  won: number
}

export interface FunnelData {
  stage: string
  count: number
}

export interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
