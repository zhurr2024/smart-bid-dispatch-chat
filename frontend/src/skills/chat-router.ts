export type IntentType =
  | 'FILTER_HIGH_PRIORITY'   // 查看高优标讯
  | 'FILTER_PENDING'         // 待分配标讯
  | 'FILTER_TODAY'           // 今日新增
  | 'FILTER_DEADLINE'        // 即将截止
  | 'FILTER_REGION'          // 按地区筛选
  | 'SEARCH_KEYWORD'         // 关键词搜索
  | 'FILTER_TYPE_ISG'        // ISG标讯
  | 'FILTER_TYPE_SSG'        // SSG标讯
  | 'FILTER_STATUS'          // 按状态筛选
  | 'UNKNOWN'                // 未识别

export interface ParsedIntent {
  intent: IntentType
  params: Record<string, string>
  /** Human-readable description of what will be filtered */
  displayText: string
}

const REGIONS = ['华北', '华南', '华东', '华中', '西部', '东北', '西北', '西南', '华西']

const STATUS_MAP: Record<string, string> = {
  '已分配': 'ASSIGNED',
  '已接收': 'RECEIVED',
  '跟进中': 'IN_PROGRESS',
  '有商机': 'OPPORTUNITY',
  '无商机': 'NO_OPPORTUNITY',
  '完成': 'COMPLETED',
}

export function parseIntent(input: string): ParsedIntent {
  const text = input.trim()

  if (!text) {
    return { intent: 'UNKNOWN', params: {}, displayText: '' }
  }

  // High priority
  if (/高优|高优先|高价值|重要/.test(text)) {
    return { intent: 'FILTER_HIGH_PRIORITY', params: { priority: 'HIGH' }, displayText: '高优先级标讯' }
  }

  // Pending / unassigned — checked before STATUS_MAP to avoid collision with '已分配'
  if (/待分配|未分配/.test(text)) {
    return { intent: 'FILTER_PENDING', params: { status: 'PENDING' }, displayText: '待分配标讯' }
  }

  // Today
  if (/今天|今日/.test(text)) {
    const today = new Date().toISOString().slice(0, 10)
    return { intent: 'FILTER_TODAY', params: { publishedAfter: today }, displayText: '今日新增标讯' }
  }

  // Deadline
  if (/截止|到期|即将截止|临近截止/.test(text)) {
    return { intent: 'FILTER_DEADLINE', params: { deadlineSoon: 'true' }, displayText: '即将截止标讯' }
  }

  // ISG  (case-insensitive via regex flag)
  if (/ISG/i.test(text)) {
    return { intent: 'FILTER_TYPE_ISG', params: { bidType: 'ISG' }, displayText: 'ISG 标讯' }
  }

  // SSG
  if (/SSG/i.test(text)) {
    return { intent: 'FILTER_TYPE_SSG', params: { bidType: 'SSG' }, displayText: 'SSG 标讯' }
  }

  // Region
  for (const region of REGIONS) {
    if (text.includes(region)) {
      return { intent: 'FILTER_REGION', params: { region }, displayText: `${region}地区标讯` }
    }
  }

  // General status keywords
  for (const [keyword, statusValue] of Object.entries(STATUS_MAP)) {
    if (text.includes(keyword)) {
      return { intent: 'FILTER_STATUS', params: { status: statusValue }, displayText: `状态: ${keyword}` }
    }
  }

  // Keyword fallback
  return { intent: 'SEARCH_KEYWORD', params: { search: text }, displayText: `搜索: ${text}` }
}

/** Convert a ParsedIntent back to the query-params object consumed by useBids */
export function intentToQuery(intent: ParsedIntent): Record<string, string> {
  return intent.params
}
