import React from 'react'
import { DollarSign, Calendar, Package, Briefcase, Users } from 'lucide-react'

/** 历史案例推荐 - 静态模块，内容与移动端保持一致 */
export const BidHistoryCases: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-2)]">
        为您匹配 <span className="font-semibold text-[var(--brand-6)]">5</span> 个相似客户成交案例，可作为本次标讯解决方案设计与客户沟通的参考。
      </p>

      <div className="space-y-4">
        <CaseCard
          name="某大型国有银行"
          amount="$5M"
          tags={['金融', '国有银行', '北京战区']}
          description="基础设施一体化建设项目"
          orderTime="FY25Q3"
          product="服务器"
          scenario="智能化转型"
          team={['ARchenly15', 'SSchenly16', 'SEchenly17']}
        />
        <CaseCard
          name="某领先手机制造企业"
          amount="$3.2M"
          tags={['制造', '离散轻工', '广西战区']}
          description="AI训练集群建设项目"
          orderTime="FY25Q2"
          product="GPU服务器"
          scenario="AI大模型训练"
          team={['ARwangjun08', 'SSliuwei12', 'SEzhaomin25']}
        />
        <CaseCard
          name="某顶尖985高校"
          amount="$1.8M"
          tags={['教育', '高等教育', '上海战区']}
          description="智慧校园云平台升级项目"
          orderTime="FY25Q1"
          product="超融合一体机"
          scenario="教育信息化"
          team={['ARsunfang19', 'SShuangli33', 'SEchenkai41']}
        />
        <CaseCard
          name="某省会三甲综合医院"
          amount="$2.4M"
          tags={['医疗', '三甲医院', '成都战区']}
          description="医疗影像PACS系统扩容项目"
          orderTime="FY24Q4"
          product="存储阵列"
          scenario="影像数据集中管理"
          team={['ARlichao27', 'SSzhouyu48', 'SEtangping52']}
        />
        <CaseCard
          name="某东部省会政务云建设中心"
          amount="$4.6M"
          tags={['政府', '智慧城市', '杭州战区']}
          description="政务云二期扩建项目"
          orderTime="FY24Q3"
          product="云服务器集群"
          scenario="政务服务一体化"
          team={['ARmaoxiang31', 'SSpenglin44', 'SEgaoyuan58']}
        />
      </div>
    </div>
  )
}

interface CaseCardProps {
  name: string
  amount: string
  tags: string[]
  description: string
  orderTime: string
  product: string
  scenario: string
  team: string[]
}

const CaseCard: React.FC<CaseCardProps> = ({ name, amount, tags, description, orderTime, product, scenario, team }) => (
  <div className="bg-white rounded-[8px] shadow-card p-5">
    {/* Header */}
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-[var(--text-1)]">{name}</h3>
      <div className="flex items-center gap-1 text-emerald-600">
        <DollarSign size={14} />
        <span className="text-sm font-semibold">{amount}</span>
      </div>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5 mb-2">
      {tags.map(tag => (
        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--fill-2)] text-[var(--text-2)]">
          {tag}
        </span>
      ))}
    </div>

    {/* Description */}
    <p className="text-sm text-[var(--text-2)] mb-3">{description}</p>

    {/* Details */}
    <div className="flex items-center gap-4 text-xs text-[var(--text-3)] mb-3">
      <div className="flex items-center gap-1">
        <Calendar size={12} />
        <span>下单时间</span>
        <span className="text-[var(--text-2)] font-medium">{orderTime}</span>
      </div>
      <div className="flex items-center gap-1">
        <Package size={12} />
        <span>产品</span>
        <span className="text-[var(--text-2)] font-medium">{product}</span>
      </div>
      <div className="flex items-center gap-1">
        <Briefcase size={12} />
        <span>业务场景</span>
        <span className="text-[var(--text-2)] font-medium">{scenario}</span>
      </div>
    </div>

    {/* Team */}
    <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-1)]">
      <Users size={12} className="text-[var(--text-3)]" />
      <div className="flex flex-wrap gap-2">
        {team.map(member => (
          <span key={member} className="text-xs text-[var(--text-2)]">{member}</span>
        ))}
      </div>
    </div>
  </div>
)
