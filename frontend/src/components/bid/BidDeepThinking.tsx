import React from 'react'
import { Building2, Tag, TrendingUp, Newspaper, Globe, History, BarChart3 } from 'lucide-react'

/** 标讯深度思考 - 静态模块，内容与移动端保持一致 */
export const BidDeepThinking: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 基础信息 */}
      <Section icon={<Building2 size={16} />} title="基础信息">
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="客户名称" value="深圳荣耀智能机器有限公司" />
          <InfoItem label="客户编号" value="L15009265x" />
          <InfoItem label="行业纵队" value="制造" />
          <InfoItem label="战区" value="广西战区" />
        </div>
      </Section>

      {/* 客户标签 */}
      <Section icon={<Tag size={16} />} title="客户标签">
        <div className="flex flex-wrap gap-2">
          {['制造行业', '广西战区', '高价值客户', '战略重点客户', 'AI转型期', '全球化扩张'].map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[var(--brand-1)] text-[var(--brand-6)] border border-[var(--brand-2)]">
              {tag}
            </span>
          ))}
        </div>
      </Section>

      {/* 财报分析 */}
      <Section icon={<TrendingUp size={16} />} title="财报分析">
        <div className="space-y-2 text-sm text-[var(--text-2)] leading-relaxed">
          <p>荣耀终端近三年营收保持稳健增长态势，FY2025实现营收约580亿元，同比增长12%。</p>
          <p>主营业务方面，智能手机仍占营收主体（约65%），但IoT与智慧生活产品增速显著（同比+28%）。创新业务层面，荣耀加速布局AI大模型端侧部署，MagicOS 9.0全面接入端云协同AI能力，同时积极拓展企业级解决方案市场，面向教育、医疗等垂直行业推出定制化终端产品组合。</p>
        </div>
      </Section>

      {/* 企业情报 */}
      <Section icon={<Globe size={16} />} title="企业情报">
        <div className="space-y-2 text-sm text-[var(--text-2)] leading-relaxed">
          <p>荣耀近期发布新一代MagicBook商用笔记本系列，主打AI本地化能力和企业安全管理特性，计划在教育和政企市场大规模推广，预计Q3采购需求集中释放。</p>
          <p>荣耀研发中心正在扩建内部AI训练集群，对高性能GPU服务器和存储设备有明确采购计划，预算规模约2000万元，预计下半年启动招标。</p>
          <p>荣耀全球化扩张加速，海外研发中心（欧洲、东南亚）正在进行IT基础设施建设规划，涉及私有云部署、数据中心建设等，存在大型基础设施一体化解决方案合作机会。</p>
        </div>
      </Section>

      {/* 历史交易 */}
      <Section icon={<History size={16} />} title="历史交易">
        {/* 图表 */}
        <div className="mb-4">
          <div className="text-xs text-[var(--text-3)] mb-2">历史交易金额趋势</div>
          <div className="flex items-center gap-4 mb-3">
            <Legend color="bg-blue-500" label="REL" />
            <Legend color="bg-emerald-500" label="ISG" />
            <Legend color="bg-amber-500" label="SSG" />
          </div>
          <div className="flex items-end gap-6 h-32 px-2">
            <BarGroup label="FY2023" rel={10000} isg={2000} ssg={1500} max={12000} />
            <BarGroup label="FY2024" rel={11000} isg={2000} ssg={1500} max={12000} />
            <BarGroup label="FY2025" rel={12000} isg={2000} ssg={1500} max={12000} />
          </div>
          <div className="text-xs text-[var(--text-3)] text-center mt-1">金额 (万元)</div>
        </div>
        {/* 表格 */}
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-2)]">
              <th className="text-left py-2 px-2 text-[var(--text-3)] font-medium">BU</th>
              <th className="text-right py-2 px-2 text-[var(--text-3)] font-medium">FY2023(万元)</th>
              <th className="text-right py-2 px-2 text-[var(--text-3)] font-medium">FY2024(万元)</th>
              <th className="text-right py-2 px-2 text-[var(--text-3)] font-medium">FY2025(万元)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border-1)]">
              <td className="py-2 px-2 text-[var(--text-1)]">REL</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">10,000</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">11,000</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">12,000</td>
            </tr>
            <tr className="border-b border-[var(--border-1)]">
              <td className="py-2 px-2 text-[var(--text-1)]">ISG</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">2,000</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">2,000</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">2,000</td>
            </tr>
            <tr className="border-b border-[var(--border-1)]">
              <td className="py-2 px-2 text-[var(--text-1)]">SSG</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">1,500</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">1,500</td>
              <td className="py-2 px-2 text-right text-[var(--text-2)]">1,500</td>
            </tr>
            <tr className="font-medium">
              <td className="py-2 px-2 text-[var(--text-1)]">总计</td>
              <td className="py-2 px-2 text-right text-[var(--text-1)]">13,500</td>
              <td className="py-2 px-2 text-right text-[var(--text-1)]">14,500</td>
              <td className="py-2 px-2 text-right text-[var(--text-1)]">15,500</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* 客户新闻 */}
      <Section icon={<Newspaper size={16} />} title="客户新闻">
        <div className="space-y-2 text-sm text-[var(--text-2)] leading-relaxed">
          <p>【PC硬件】荣耀近期发布新一代MagicBook商用笔记本系列，主打AI本地化能力和企业安全管理特性，计划在教育和政企市场大规模推广，预计Q3采购需求集中释放。</p>
          <p>【服务器/基础设施】荣耀研发中心正在扩建内部AI训练集群，对高性能GPU服务器和存储设备有明确采购计划，预算规模约2000万元，预计下半年启动招标。</p>
          <p>【方案服务】荣耀全球化扩张加速，海外研发中心（欧洲、东南亚）正在进行IT基础设施建设规划，涉及私有云部署、数据中心建设等，存在大型基础设施一体化解决方案合作机会。</p>
        </div>
      </Section>

      {/* 行业情报 */}
      <Section icon={<BarChart3 size={16} />} title="行业情报">
        <div className="space-y-2 text-sm text-[var(--text-2)] leading-relaxed">
          <p>制造行业全球化扩张加速，海外研发中心（欧洲、东南亚）正在进行IT基础设施建设规划，涉及私有云部署、数据中心建设等，</p>
          <p>存在大型基础设施一体化解决方案合作机会。</p>
        </div>
      </Section>
    </div>
  )
}

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-[8px] shadow-card p-5">
    <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
      <span className="text-[var(--brand-6)]">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
)

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-[var(--text-3)]">{label}</div>
    <div className="text-sm text-[var(--text-1)] mt-0.5">{value}</div>
  </div>
)

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span className={`w-3 h-3 rounded-sm ${color}`} />
    <span className="text-xs text-[var(--text-2)]">{label}</span>
  </div>
)

const BarGroup: React.FC<{ label: string; rel: number; isg: number; ssg: number; max: number }> = ({ label, rel, isg, ssg, max }) => (
  <div className="flex-1 flex flex-col items-center gap-1">
    <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100px' }}>
      <div className="w-8 bg-blue-500 rounded-t-sm" style={{ height: `${(rel / max) * 100}%` }} title={`REL: ${rel}`} />
      <div className="w-8 bg-emerald-500 rounded-t-sm" style={{ height: `${(isg / max) * 100}%` }} title={`ISG: ${isg}`} />
      <div className="w-8 bg-amber-500 rounded-t-sm" style={{ height: `${(ssg / max) * 100}%` }} title={`SSG: ${ssg}`} />
    </div>
    <span className="text-xs text-[var(--text-3)]">{label}</span>
  </div>
)
