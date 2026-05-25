/**
 * 标讯反馈流程相关枚举值和常量
 */

/** 无商机原因预置选项（7项，单选） */
export const NO_OPPORTUNITY_REASONS = [
  { value: 'NO_ISG_DEMAND', label: '无 ISG 需求' },
  { value: 'PRODUCT_PARAM_MISMATCH', label: '产品 / 参数不匹配' },
  { value: 'NO_PARAM_PROVIDED', label: '客户暂未提供参数要求' },
  { value: 'COMPETITOR_FACTOR', label: '友商竞争因素' },
  { value: 'PROJECT_SUSPENDED', label: '项目暂停、取消或时机不对' },
  { value: 'EXTERNAL_FACTOR', label: '外部环境政策、市场等不可控因素' },
  { value: 'OTHER', label: '其他原因' },
] as const

/** 事业部选项 */
export const BUSINESS_UNIT_OPTIONS = [
  { value: 'ISG', label: 'ISG' },
  { value: 'SSG', label: 'SSG' },
]

/** 商机来源选项 */
export const OPPORTUNITY_SOURCE_OPTIONS = [
  { value: 'BID_CONVERSION', label: '标讯转化' },
  { value: 'CUSTOMER_REFERRAL', label: '客户推荐' },
  { value: 'PARTNER_REFERRAL', label: '合作伙伴推荐' },
  { value: 'SELF_DISCOVERY', label: '自行挖掘' },
]

/** 商机阶段选项 */
export const OPPORTUNITY_STAGE_OPTIONS = [
  { value: 'DISCOVER_NEED', label: '发现需求' },
  { value: 'INITIAL_CONTACT', label: '初步接触' },
  { value: 'SOLUTION_DISCUSS', label: '方案沟通' },
  { value: 'QUOTATION', label: '报价阶段' },
  { value: 'APPROVAL', label: '审批中' },
  { value: 'SIGNING', label: '签约' },
]

/** 采购模式选项 */
export const PURCHASE_MODE_OPTIONS = [
  { value: 'NORMAL', label: '普通采购' },
  { value: 'FRAMEWORK', label: '框架协议' },
  { value: 'BIDDING', label: '招标采购' },
  { value: 'DIRECT', label: '直接采购' },
]

/** 产品域选项 */
export const PRODUCT_DOMAIN_OPTIONS = [
  { value: 'SERVER', label: '服务器' },
  { value: 'STORAGE', label: '存储' },
  { value: 'NETWORK', label: '网络' },
  { value: 'SOFTWARE', label: '软件' },
  { value: 'HCI', label: '超融合' },
  { value: 'CLOUD', label: '云计算' },
  { value: 'SOLUTION', label: '解决方案' },
]

/** 赢率选项 */
export const WIN_RATE_OPTIONS = [
  { value: '10%', label: '10%' },
  { value: '20%', label: '20%' },
  { value: '30%', label: '30%' },
  { value: '40%', label: '40%' },
  { value: '50%', label: '50%' },
  { value: '60%', label: '60%' },
  { value: '70%', label: '70%' },
  { value: '80%', label: '80%' },
  { value: '90%', label: '90%' },
  { value: '100%', label: '100%' },
]

/** 是否有解决方案机会 */
export const SOLUTION_OPPORTUNITY_OPTIONS = [
  { value: 'YES', label: '是' },
  { value: 'NO', label: '否' },
]

/** 物料产品组选项 */
export const MATERIAL_PRODUCT_GROUP_OPTIONS = [
  { value: 'RACK_SERVER', label: '机架服务器' },
  { value: 'TOWER_SERVER', label: '塔式服务器' },
  { value: 'BLADE_SERVER', label: '刀片服务器' },
  { value: 'HPC', label: '高性能计算' },
  { value: 'STORAGE_DISK', label: '磁盘存储' },
  { value: 'STORAGE_ALL_FLASH', label: '全闪存储' },
  { value: 'NETWORK_SWITCH', label: '网络交换机' },
  { value: 'SOFTWARE_LICENSE', label: '软件许可' },
  { value: 'SERVICE', label: '服务' },
]

/** 是否高价值选项 */
export const HIGH_VALUE_OPTIONS = [
  { value: 'YES', label: '是' },
  { value: 'NO', label: '否' },
]

/** 是否真实标讯（ISG产品）选项 */
export const IS_REAL_BID_OPTIONS = [
  { value: 'YES', label: '是' },
  { value: 'NO', label: '否' },
]

/** 反馈状态标签 */
export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  PENDING_FEEDBACK: '待反馈',
  NOT_REAL_BID: '非真实标讯',
  FOLLOWING_UP: '跟进中',
  NO_OPPORTUNITY: '无商机',
  LINKED_OPPORTUNITY: '已关联商机',
  CREATED_OPPORTUNITY: '已创建商机',
}

/** 上传模板字段 */
export const UPLOAD_TEMPLATE_FIELDS = [
  '招标类型',
  '信息提交时间',
  '战区',
  '省份',
  '城市',
  '主行业',
  '公告名称',
  '采购单位',
  '项目名称',
  '采购需求概况',
  '数量总计',
  '关键词',
  '预算金额（万元）',
  '预计采购开始时间',
  '预计采购截止时间',
  '采购人电话',
  '采购人联系人',
  '原始文章链接',
]

/** 下载模板字段 */
export const DOWNLOAD_TEMPLATE_FIELDS = [
  '标讯编号',
  '招标类型',
  '信息提交时间',
  '战区',
  '省份',
  '城市',
  '主行业',
  '公告名称',
  '采购单位',
  '项目名称',
  '采购需求概况',
  '数量总计',
  '关键词',
  '预算金额（万元）',
  '预计采购开始时间',
  '预计采购截止时间',
  '采购人电话',
  '采购人联系人',
  '原始文章链接',
  '标讯是否真实(ISG产品）',
  '商机编号',
  '未反馈商机编号原因',
  '关联产品',
  '负责人（itcode）',
]
