export type UserRole = 'HQ_OPS' | 'TEAM_LEADER' | 'SALES_ADMIN' | 'AR' | 'PRODUCT_MGR'
export type BidType = 'ISG' | 'SSG'
export type TenderType = 'INTENT' | 'FORMAL'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type BidStatus =
  | 'UPLOADED'
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'OPPORTUNITY'
  | 'NO_OPPORTUNITY'
  | 'LINKED_OPPORTUNITY'
  | 'COMPLETED'

/** AR反馈状态 */
export type FeedbackStatus =
  | 'PENDING_FEEDBACK'
  | 'NOT_REAL_BID'
  | 'FOLLOWING_UP'
  | 'NO_OPPORTUNITY'
  | 'LINKED_OPPORTUNITY'
  | 'CREATED_OPPORTUNITY'

export type OpportunityStage =
  | 'DISCOVER_NEED'
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
  province?: string
  city?: string
  industry?: string
  budget?: number
  publishedAt: string
  deadlineAt?: string
  summary: string
  keywords?: string[]
  source?: string
  priority: Priority
  opportunityNo?: string
  status: BidStatus
  assignedTo?: string
  assignedToUser?: User
  isRead?: boolean
  matchedProducts?: MatchedProduct[]
  // 新增反馈流程字段
  isRealBid?: boolean | null       // 是否真实标讯(ISG产品)
  isHighValue?: boolean | null     // 是否高价值
  feedbackStatus?: FeedbackStatus  // AR反馈状态
  noOpportunityReason?: string     // 无商机原因
  followupRemarks?: FollowupRemark[] // 跟进中备注(时间倒序堆叠)
  linkedOpportunityId?: string     // 关联商机ID
  createdOpportunityId?: string    // 创建商机ID
  feedbackUser?: string            // 反馈人
  feedbackTime?: string            // 反馈时间
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FollowupRemark {
  content: string
  createdAt: string
  userId: string
  userName: string
}

export interface ProductKeywordMapping {
  id: string
  productName: string
  productManager: string
  productManagerId: string
  keywords: string[]
}

export interface MatchedProduct {
  productName: string
  productManager: string
  productManagerId: string
  matchedKeywords: string[]
  arName?: string
  arItcode?: string
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
  businessUnit?: string            // 事业部
  opportunitySource?: string       // 商机来源
  customerName?: string            // 客户名称
  cdbId?: string                   // CDBID
  opportunityStage?: string        // 商机阶段
  purchaseMode?: string            // 采购模式
  productDomain?: string           // 产品域
  estimatedAmount?: number
  estimatedCloseDate?: string
  winRate?: string                 // 赢率
  hasSolutionOpportunity?: string  // 是否有解决方案机会
  competitors?: string[]
  stage: OpportunityStage
  notes?: string
  result?: 'WON' | 'LOST'
  lostReason?: string
  productDetails?: ProductDetail[] // 产品明细
  createdAt: string
  updatedAt: string
}

export interface ProductDetail {
  materialProductGroup: string     // 物料产品组
  productLine?: string             // 产线
  estimatedRevenue: number         // 预计收入总金额
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
