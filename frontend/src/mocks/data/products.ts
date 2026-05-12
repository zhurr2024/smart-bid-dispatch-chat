import { ProductKeywordMapping } from '@/types'

export const mockProductKeywordMappings: ProductKeywordMapping[] = [
  {
    id: 'prod-001',
    productName: 'WXVDI软件',
    productManager: '周产品',
    productManagerId: 'user-pm-001',
    keywords: ['VDI', '桌面虚拟化', '虚拟桌面', '云桌面', '云教室', '云课堂', '深信服', '锐捷'],
  },
  {
    id: 'prod-002',
    productName: '英伟达软件',
    productManager: '周产品',
    productManagerId: 'user-pm-001',
    keywords: ['GPU虚拟化', 'GPU调度', 'VGPU', 'NVIDIA', 'UFM', '网络管理解决方案'],
  },
  {
    id: 'prod-003',
    productName: '超融合平台',
    productManager: '孙产品',
    productManagerId: 'user-pm-002',
    keywords: ['超融合', 'HCI', '分布式存储', '软件定义', '虚拟化平台'],
  },
  {
    id: 'prod-004',
    productName: '信创服务器',
    productManager: '孙产品',
    productManagerId: 'user-pm-002',
    keywords: ['信创', '国产化', '国产服务器', '飞腾', '鲲鹏', '海光'],
  },
  {
    id: 'prod-005',
    productName: '智慧医疗解决方案',
    productManager: '周产品',
    productManagerId: 'user-pm-001',
    keywords: ['HIS', '医疗IT', '电子病历', '智慧医院', '医院信息化'],
  },
  {
    id: 'prod-006',
    productName: '智慧教育解决方案',
    productManager: '孙产品',
    productManagerId: 'user-pm-002',
    keywords: ['智慧校园', '数字化校园', '教育信息化', '教学一体机', '电子教室'],
  },
]
