# PRD · 智能标讯分发系统（Smart Bid Dispatch Chat）

> **版本**：v1.0 | **日期**：2026-04-29 | **状态**：待评审

---

## 目录

1. [产品概述](#1-产品概述)
2. [背景与目标](#2-背景与目标)
3. [用户角色与权限](#3-用户角色与权限)
4. [功能需求](#4-功能需求)
5. [非功能需求](#5-非功能需求)
6. [系统架构](#6-系统架构)
7. [数据模型](#7-数据模型)
8. [页面模块设计](#8-页面模块设计)
9. [UI/UX 设计规范](#9-uiux-设计规范)
10. [API 接口设计（Mock）](#10-api-接口设计mock)
11. [技术栈](#11-技术栈)
12. [里程碑规划](#12-里程碑规划)

---

## 1. 产品概述

**产品名称**：Smart Bid Dispatch Chat — 智能标讯分发系统

**产品形态**：PC 端 Web 应用，对话式交互界面，前后端分离架构

**核心价值**：
- 将原有纯人工线下标讯分发流程数字化、智能化
- 打通「标讯采集 → 智能分析 → 精准分发 → 销售跟进 → 数据闭环」全链路
- 重点支持意向标讯（前期采购信号）的快速流转，抢占经营窗口

---

## 2. 背景与目标

### 2.1 现状痛点

| 问题 | 影响 |
|------|------|
| 纯手工线下下发，时效性差 | 销售无法第一时间获取标讯，错失早期介入机会 |
| 线下收集反馈，周期滞后 | 管理层无法实时了解市场经营状态 |
| 缺乏标讯分级，低质信息占用资源 | 高价值标讯得不到优先处理 |
| 无数据沉淀，无法形成经营洞察 | WinLoss 闭环缺失，无法指导后续优化 |

### 2.2 产品目标

**一、覆盖两类标讯信息**
- 实时招标（已正式发布）：确保覆盖率和响应完整性
- 意向招标（未正式发布 / 前期采购信号）：重点经营对象，价值更高

**二、标讯智能分级**
- 系统自动分析标讯价值，高价值优先流转
- 避免销售资源被低质量信息占用

**三、响应速度作为核心 KPI**
- 高意向标讯设定明确的首响应时间要求
- 用「更快」直接撬动转化率提升

**四、数据闭环管理（WinLoss）**
- 记录标讯跟进全过程和最终结果
- 形成可复用的经营洞察，指导销售与区域经营

---

## 3. 用户角色与权限

| 角色 | 英文标识 | 核心职责 | 权限范围 |
|------|----------|----------|----------|
| 运营总部 | `HQ_OPS` | 标讯采集、上传、下载、跟进追踪 | 全量数据读写、上传模板、分配管理、数据导出 |
| 纵队 Leader | `TEAM_LEADER` | 查看标讯、跟进打状态 | 本纵队标讯查看 + 状态更新 |
| 销管 | `SALES_ADMIN` | 手工分配标讯、追踪销售跟进 | 标讯分配、跟进状态查看、催办 |
| 大区 Leader | `REGION_LEADER` | 查看本大区标讯全貌 | 本大区标讯只读 + 汇总报表 |
| AR（客户经理） | `AR` | 报商机、提交反馈 | 分配给自己的标讯查看 + 商机上报 + 状态反馈 |

### 角色权限矩阵

| 功能 | HQ_OPS | TEAM_LEADER | SALES_ADMIN | REGION_LEADER | AR |
|------|--------|-------------|-------------|---------------|----|
| 标讯上传 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 查看全量标讯 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 查看本大区标讯 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 查看分配标讯 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 手工分配标讯 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 更新跟进状态 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 报商机 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 标记已读（SSG） | ✅ | ✅ | ✅ | ✅ | ✅ |
| 数据导出 | ✅ | ❌ | ✅ | ✅（只读） | ❌ |
| 系统配置 | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 4. 功能需求

### 4.1 标讯数据采集模块

**触发角色**：运营总部（HQ_OPS）

**功能描述**：
- 支持 Excel 模板文件上传（参考 ISG 历史下发标讯格式）
- 上传时进行字段校验，异常行高亮提示
- 支持模板下载（标准格式）
- 支持历史上传记录查看与重新处理

**Excel 上传字段规范（基于样本数据）**：

| 字段名 | 说明 | 必填 | 类型 |
|--------|------|------|------|
| 标讯编号 | 唯一标识 | 是 | 字符串 |
| 标讯类型 | ISG / SSG | 是 | 枚举 |
| 招标类型 | 实时招标 / 意向招标 | 是 | 枚举 |
| 项目名称 | 采购项目全名 | 是 | 字符串 |
| 采购单位 | 甲方名称 | 是 | 字符串 |
| 项目地点 | 省市区 | 是 | 字符串 |
| 大区 | 销售大区 | 是 | 枚举 |
| 预算金额 | 万元 | 否 | 数字 |
| 发布时间 | | 是 | 日期 |
| 截止时间 | 招标截止 | 否 | 日期 |
| 项目概述 | 摘要描述 | 是 | 文本 |
| 关键词 | 逗号分隔 | 否 | 字符串 |
| 信息来源 | 外部数据提供商 | 否 | 字符串 |
| 优先级 | 系统自动打分 | 自动 | 枚举（高/中/低）|

### 4.2 标讯智能分析模块

**触发时机**：Excel 上传成功后自动执行

**功能描述**：
- 自动提取结构化字段（项目名、采购方、金额、地点、时间）
- 基于规则引擎自动评级（高/中/低）：
  - 意向招标 > 实时招标
  - 金额越大优先级越高
  - 截止时间紧迫度加权
- 生成标讯摘要卡片，含关键信息高亮
- 对话式交互：销管 / 运营可在聊天面板追问标讯详情

**分级规则参考**：

| 优先级 | 触发条件 |
|--------|----------|
| 🔴 高 | 意向招标 + 预算 ≥ 500万 OR 截止时间 ≤ 7天 |
| 🟡 中 | 实时招标 + 预算 100-500万 OR 截止时间 7-30天 |
| 🟢 低 | 金额 < 100万 OR 信息不完整 |

### 4.3 标讯分配模块

**功能描述**：
- **自动分配**：根据大区字段 + 当前 AR 归属关系自动推送
- **手工分配**：销管可在分配面板手动指定 AR，支持批量操作
- **分配记录**：所有分配操作留痕，可追溯
- **响应超时提醒**：高优先级标讯超 24h 未响应，系统自动提醒销管

**对话式分配流程**（Chat 界面内）：
1. 系统在聊天窗口推送新标讯卡片
2. 销管点击「分配」→ 弹出 AR 选择 Popover
3. 确认后系统自动发送分配通知给 AR

### 4.4 标讯跟踪模块

**功能描述**：
- AR 在对话面板内查看分配标讯详情
- **ISG 标讯**：需填写跟进状态 + 商机上报 + 闭环反馈
- **SSG 标讯**：仅需标记「已读」，不做商机跟进
- 跟进状态流转：

```
待响应 → 已接收 → 跟进中 → 商机上报 → 赢单/输单/放弃
```

- 每个节点可填写跟进备注
- 历史跟进记录按时间线展示（类聊天气泡）

### 4.5 商机上报模块（AR 专属）

**功能描述**：
- ISG 标讯跟进中，AR 可在对话面板内提交商机表单：
  - 商机名称（默认同项目名）
  - 预计合同金额
  - 预计签单时间
  - 竞争对手
  - 当前阶段（初步接触 / 方案洽谈 / 报价 / 立项 / 签约）
  - 备注
- 提交后同步更新标讯跟进状态为「商机上报」
- 运营总部可查看商机汇总报表

### 4.6 数据闭环管理（WinLoss）

**功能描述**：
- 最终结果录入：赢单 / 输单 / 放弃，并填写原因
- 系统自动汇总各大区 / 各 BU 的转化漏斗数据
- 报表维度：
  - 按月份 / 季度的标讯总量 & 响应率
  - 高优先级标讯平均首响应时长
  - 各大区商机转化率
  - 意向标讯 vs 实时招标转化率对比
  - WinLoss 原因分布

### 4.7 对话式主界面（Chat 核心）

**界面布局（三栏式）**：

```
┌──────────────────────────────────────────────────────────────────┐
│  顶部导航栏（Logo + 角色切换 + 通知铃 + 用户头像）              │
├─────────┬──────────────────────────────┬────────────────────────┤
│         │                              │                        │
│  左侧   │   中央聊天面板               │   右侧详情面板         │
│  导航   │   （对话 / 标讯消息流）      │   （标讯卡片详情/      │
│  栏     │                              │    商机表单/报表）     │
│  240px  │   主要工作区                 │   360px                │
│         │                              │                        │
└─────────┴──────────────────────────────┴────────────────────────┘
```

**左侧导航功能**：
- 标讯总览
- 我的标讯
- 待处理（带红点角标）
- 分配管理（销管可见）
- 数据报表
- 系统设置（运营总部可见）

**聊天消息类型**：
- 系统通知：新标讯推送卡片
- 标讯摘要卡（带优先级色标）
- 跟进状态更新消息
- 商机上报提交确认
- 超时提醒警告

---

## 5. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | 标讯列表首屏加载 < 2s；聊天消息实时推送延迟 < 500ms |
| 安全 | 基于角色的访问控制（RBAC）；API 鉴权（JWT）；数据传输 HTTPS |
| 兼容性 | 支持 Chrome 90+、Edge 90+；分辨率 1366×768 以上 |
| 可维护 | 模块化代码结构，API Mock 可配置；支持后续规则引擎扩展 |
| 可扩展 | 以 Skill 模块形式组织业务逻辑，方便迭代维护 |

---

## 6. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                     前端（Frontend）                     │
│  React 18 + TypeScript + Vite                           │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │  Chat UI    │ │  Dashboard   │ │  Admin / Upload  │  │
│  │  (对话面板) │ │  (报表看板)  │ │  (上传/分配管理) │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
│  Tailwind CSS + Lucide Icons + Recharts                  │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API / WebSocket
┌───────────────────────▼─────────────────────────────────┐
│                    后端（Backend）                        │
│  Node.js + Express / Fastify（或 Python FastAPI）       │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Skills（模块化业务逻辑）                        │    │
│  │  ├── bid-ingestion   标讯采集 Skill              │    │
│  │  ├── bid-analysis    标讯分析 Skill              │    │
│  │  ├── bid-dispatch    标讯分发 Skill              │    │
│  │  ├── bid-tracking    标讯跟踪 Skill              │    │
│  │  ├── opportunity     商机管理 Skill              │    │
│  │  └── reporting       数据报表 Skill              │    │
│  └─────────────────────────────────────────────────┘    │
│  Mock API Layer（JSON Server / MSW）                     │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    数据层（Data）                         │
│  SQLite（开发）/ PostgreSQL（生产）                      │
│  Redis（消息队列 & 实时通知）                            │
└─────────────────────────────────────────────────────────┘
```

---

## 7. 数据模型

### 7.1 标讯（Bid）

```typescript
interface Bid {
  id: string;                    // 唯一标识 UUID
  bidNo: string;                 // 标讯编号
  bidType: 'ISG' | 'SSG';       // 业务单元
  tenderType: 'INTENT' | 'FORMAL'; // 意向招标 / 实时招标
  projectName: string;           // 项目名称
  purchaserName: string;         // 采购单位
  location: string;              // 项目地点
  region: string;                // 大区
  budget?: number;               // 预算金额（万元）
  publishedAt: Date;             // 发布时间
  deadlineAt?: Date;             // 截止时间
  summary: string;               // 项目概述
  keywords?: string[];           // 关键词
  source?: string;               // 信息来源
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // 优先级（系统计算）
  status: BidStatus;             // 当前状态
  assignedTo?: string;           // 分配给（AR userId）
  createdBy: string;             // 上传人
  createdAt: Date;
  updatedAt: Date;
}

type BidStatus = 
  | 'PENDING'        // 待分配
  | 'ASSIGNED'       // 已分配
  | 'RECEIVED'       // AR已接收
  | 'IN_PROGRESS'    // 跟进中
  | 'OPPORTUNITY'    // 商机上报
  | 'WON'            // 赢单
  | 'LOST'           // 输单
  | 'ABANDONED';     // 放弃
```

### 7.2 跟进记录（TrackRecord）

```typescript
interface TrackRecord {
  id: string;
  bidId: string;
  userId: string;
  action: string;             // 操作类型
  status: BidStatus;          // 变更后状态
  note?: string;              // 跟进备注
  createdAt: Date;
}
```

### 7.3 商机（Opportunity）

```typescript
interface Opportunity {
  id: string;
  bidId: string;
  arUserId: string;
  opportunityName: string;
  estimatedAmount?: number;     // 预计合同金额（万元）
  estimatedCloseDate?: Date;    // 预计签单时间
  competitors?: string[];       // 竞争对手
  stage: OpportunityStage;
  notes?: string;
  result?: 'WON' | 'LOST' | 'ABANDONED';
  lostReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

type OpportunityStage = 
  | 'INITIAL_CONTACT'    // 初步接触
  | 'SOLUTION_DISCUSS'   // 方案洽谈
  | 'QUOTATION'          // 报价
  | 'APPROVAL'           // 立项
  | 'SIGNING';           // 签约
```

### 7.4 用户（User）

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'HQ_OPS' | 'TEAM_LEADER' | 'SALES_ADMIN' | 'REGION_LEADER' | 'AR';
  region?: string;          // 大区归属
  team?: string;            // 纵队归属
  avatar?: string;
  isActive: boolean;
}
```

---

## 8. 页面模块设计

### 8.1 登录页

- 企业 Logo + 产品名
- 工号/邮箱 + 密码登录
- 登录后根据角色跳转到对应默认视图

### 8.2 主界面（Chat Dashboard）

**三栏布局**：

#### 左侧导航（240px）
- Logo + 产品名
- 导航项：
  - 首页概览
  - 标讯广场（全量）
  - 我的标讯
  - 待处理 `[N]`（红色角标）
  - 分配管理（SALES_ADMIN / HQ_OPS 可见）
  - 数据报表
  - 系统设置（HQ_OPS 可见）
- 底部：用户头像 + 角色标签 + 退出

#### 中央聊天面板（flex-1）
- 顶部：当前会话标题 + 搜索框
- 消息流（自下而上时序）：
  - **系统推送卡片**：
    ```
    ┌─────────────────────────────────────┐
    │ 🔴 高优先级  意向招标               │
    │ **某某医院智慧园区项目**            │
    │ 采购方：XX集团有限公司              │
    │ 地点：广东省广州市  预算：≈800万   │
    │ 截止：3天后  大区：华南             │
    │ [查看详情]  [立即分配]              │
    └─────────────────────────────────────┘
    ```
  - **跟进状态气泡**：AR 小张 更新状态：跟进中 · 刚刚
  - **超时提醒**：⚠️ 高优标讯「某某项目」已超 24h 未响应
- 底部输入区：快捷指令 + 自由文本输入（搜索标讯、问询）

#### 右侧详情面板（360px）
- 标讯详情卡（当点击标讯时展开）
- 商机上报表单（AR 点击「报商机」时展开）
- 快捷跟进状态按钮

### 8.3 标讯管理页

- 表格视图（支持筛选、排序、分页）
- 筛选条件：大区、BU类型、优先级、状态、时间范围
- 批量操作：导出、批量分配
- 行内快速更新状态

### 8.4 标讯上传页（HQ_OPS）

- 模板下载按钮
- 拖拽上传区域（支持 .xlsx / .xls）
- 上传预览：字段匹配结果表格
- 异常行高亮（红色标注错误字段）
- 确认上传 / 取消

### 8.5 数据报表页

**模块一：概览指标卡（KPI Cards）**
- 本月标讯总量
- 高优先级标讯数
- 平均首响应时长
- 商机转化率

**模块二：趋势图表**
- 标讯量月度趋势（折线图）
- 意向 vs 实时招标对比（堆叠柱状图）

**模块三：大区分布**
- 各大区标讯数量热力图或柱状图
- WinLoss 漏斗图

---

## 9. UI/UX 设计规范

> 基于 UI UX Pro Max 设计系统规范，面向 B2B 内部 SaaS 工具

### 9.1 设计系统定位

- **产品类型**：B2B Service / Internal SaaS
- **设计风格**：Flat Design + Data-Dense（扁平 + 数据密集型）
- **目标感受**：专业、高效、清晰、可信

### 9.2 色彩系统

```
主色     Primary:     #1D4ED8  (Indigo 700)   — 操作、链接、高亮
辅色     Secondary:   #0EA5E9  (Sky 500)      — 强调、次级操作
成功     Success:     #10B981  (Emerald 500)  — 赢单、已完成
警告     Warning:     #F59E0B  (Amber 500)    — 中优先级、临期提醒
危险     Danger:      #EF4444  (Red 500)      — 高优先级、超时告警
背景     Background:  #F8FAFC  (Slate 50)     — 主背景
卡片背景 Card:        #FFFFFF                 — 卡片、面板
边框     Border:      #E2E8F0  (Slate 200)    — 分割线、边框
文字主   Text-Primary:#0F172A  (Slate 900)    — 主标题
文字副   Text-Second: #64748B  (Slate 500)    — 副文字、标签
```

### 9.3 排版系统

```
字体    Inter（正文/UI）/ 霞鹜文楷（中文备选）
      Google Fonts: Inter, 400/500/600/700

标题 H1:  24px / font-bold   / line-height: 1.25
标题 H2:  20px / font-semibold / line-height: 1.3
标题 H3:  16px / font-semibold / line-height: 1.4
正文:     14px / font-normal  / line-height: 1.6
说明文字: 12px / font-normal  / color: slate-500
```

### 9.4 间距与圆角

```
基础单位：4px
内边距：  4 / 8 / 12 / 16 / 24 / 32 px
圆角：    卡片 8px / 按钮 6px / 标签 4px / 弹窗 12px
```

### 9.5 组件规范

**按钮**：
- Primary：`bg-indigo-700 text-white hover:bg-indigo-800`
- Secondary：`border border-slate-300 bg-white hover:bg-slate-50`
- Danger：`bg-red-500 text-white hover:bg-red-600`
- 所有按钮：`cursor-pointer transition-colors duration-150`

**标签/Badge（优先级）**：
- 高：`bg-red-50 text-red-700 border border-red-200`
- 中：`bg-amber-50 text-amber-700 border border-amber-200`
- 低：`bg-slate-50 text-slate-600 border border-slate-200`
- 意向招标：`bg-indigo-50 text-indigo-700`
- 实时招标：`bg-sky-50 text-sky-700`

**卡片**：
- `bg-white rounded-lg border border-slate-200 shadow-sm`
- hover: `shadow-md transition-shadow duration-200`

**图标**：使用 Lucide React（禁止用 emoji 代替图标）

### 9.6 Chat 消息气泡规范

- **系统推送**：白色卡片，左对齐，带优先级色条（左边框 4px）
- **用户操作记录**：右对齐，`bg-indigo-50` 背景
- **系统提醒**：居中，`bg-amber-50 border border-amber-200 rounded-lg`

### 9.7 预检清单（Pre-delivery Checklist）

- [ ] 禁止使用 emoji 代替图标，统一使用 Lucide React SVG 图标
- [ ] 所有可点击元素设置 `cursor-pointer`
- [ ] hover 状态 transition 150-300ms
- [ ] 文字对比度 ≥ 4.5:1（WCAG AA）
- [ ] 键盘导航 focus 状态可见
- [ ] 响应式断点支持 1366px、1440px、1920px
- [ ] 大量列表数据使用虚拟滚动（>100 条）

---

## 10. API 接口设计（Mock）

> 所有接口使用 JSON Server 或 MSW 提供 Mock 数据，前缀 `/api/v1`

### 10.1 标讯接口

```
GET    /api/v1/bids               获取标讯列表（支持筛选分页）
GET    /api/v1/bids/:id           获取标讯详情
POST   /api/v1/bids/upload        上传 Excel 标讯（multipart/form-data）
PUT    /api/v1/bids/:id/assign    分配标讯给 AR
PUT    /api/v1/bids/:id/status    更新标讯状态
GET    /api/v1/bids/:id/tracks    获取跟进记录
POST   /api/v1/bids/:id/tracks    新增跟进记录
```

### 10.2 商机接口

```
GET    /api/v1/opportunities           获取商机列表
POST   /api/v1/opportunities           新建商机
PUT    /api/v1/opportunities/:id       更新商机
PUT    /api/v1/opportunities/:id/close 关闭商机（赢/输/放弃）
```

### 10.3 用户接口

```
POST   /api/v1/auth/login       登录
POST   /api/v1/auth/logout      退出
GET    /api/v1/users            获取用户列表（按大区/角色筛选）
GET    /api/v1/users/me         当前用户信息
```

### 10.4 报表接口

```
GET    /api/v1/reports/overview          KPI 汇总概览
GET    /api/v1/reports/trend             月度趋势数据
GET    /api/v1/reports/region-dist       大区分布
GET    /api/v1/reports/winloss-funnel    WinLoss 漏斗
```

### 10.5 Mock 数据示例

```json
{
  "bids": [
    {
      "id": "bid-001",
      "bidNo": "ISG-2024-0312-001",
      "bidType": "ISG",
      "tenderType": "INTENT",
      "projectName": "某三甲医院智慧园区基础设施采购项目",
      "purchaserName": "广州市第一人民医院",
      "location": "广东省广州市越秀区",
      "region": "华南大区",
      "budget": 850,
      "publishedAt": "2024-03-12T08:00:00Z",
      "deadlineAt": "2024-03-19T17:00:00Z",
      "summary": "采购内容涵盖服务器、存储、网络设备及相关软件，用于医院数字化升级改造",
      "keywords": ["医疗IT", "服务器", "存储", "网络"],
      "source": "政府采购网",
      "priority": "HIGH",
      "status": "ASSIGNED",
      "assignedTo": "user-ar-001",
      "createdBy": "user-hq-001",
      "createdAt": "2024-03-12T09:30:00Z",
      "updatedAt": "2024-03-12T10:00:00Z"
    }
  ]
}
```

---

## 11. 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | 核心框架 |
| Vite | 构建工具 |
| Tailwind CSS v3 | 样式框架（对应 UI UX Pro Max 规范） |
| Lucide React | 图标库（SVG，禁用 emoji） |
| Zustand | 全局状态管理 |
| React Query (TanStack) | 服务端状态 + 数据缓存 |
| React Router v6 | 路由 |
| Recharts | 报表图表 |
| react-dropzone | 文件上传 |
| xlsx（SheetJS） | Excel 解析 |
| Mock Service Worker（MSW） | API Mock |

### 后端（可选，Mock 阶段可跳过）

| 技术 | 用途 |
|------|------|
| Node.js + Fastify | Web 框架 |
| JSON Server | 快速 Mock REST API |
| Socket.io | 实时消息推送 |
| JWT | 鉴权 |
| Multer | 文件上传处理 |
| SQLite / Prisma | 数据持久化 |

### 项目结构（Skills 组织）

```
smart-bid-dispatch/
├── frontend/
│   ├── src/
│   │   ├── skills/                    # 业务 Skill 模块
│   │   │   ├── bid-ingestion/         # 标讯采集 Skill
│   │   │   ├── bid-analysis/          # 标讯分析 Skill
│   │   │   ├── bid-dispatch/          # 标讯分发 Skill
│   │   │   ├── bid-tracking/          # 标讯跟踪 Skill
│   │   │   ├── opportunity/           # 商机管理 Skill
│   │   │   └── reporting/             # 数据报表 Skill
│   │   ├── components/                # 通用组件
│   │   │   ├── chat/                  # Chat 核心组件
│   │   │   ├── bid-card/              # 标讯卡片
│   │   │   ├── forms/                 # 表单组件
│   │   │   └── charts/                # 图表组件
│   │   ├── pages/                     # 页面
│   │   ├── stores/                    # Zustand stores
│   │   ├── hooks/                     # 自定义 hooks
│   │   ├── services/                  # API 层
│   │   └── mocks/                     # MSW Mock handlers
│   └── public/
├── backend/                           # 可选后端（Mock 阶段用 JSON Server）
│   ├── src/
│   │   └── skills/                    # 后端业务 Skills
│   └── mock-data/                     # Mock JSON 数据
└── shared/
    └── types/                         # 共享 TypeScript 类型定义
```

---

## 12. 里程碑规划

### Phase 1 — 基础框架 + Chat 界面

- 项目初始化（Vite + React + Tailwind）
- 设计系统落地（色彩/字体/组件规范）
- 三栏 Chat 主界面布局
- Mock 数据接入（MSW）
- 登录页 + 路由架构

### Phase 2 — 标讯核心功能

- 标讯上传（Excel 解析 + 预览）
- 标讯列表页（筛选/排序/分页）
- 标讯详情面板（右侧）
- 标讯分配功能（手工 + 自动）
- Chat 面板标讯推送卡片

### Phase 3 — 跟踪 + 商机

- 跟进状态流转
- ISG 标讯商机上报表单
- SSG 标讯已读标记
- 跟进时间线展示

### Phase 4 — 报表 + 闭环

- 数据报表页（KPI + 趋势图 + 漏斗）
- WinLoss 录入与汇总
- 超时提醒机制
- 数据导出功能

### Phase 5 — 优化 & 上线准备

- 权限精细化验证
- 性能优化（虚拟滚动、懒加载）
- 错误边界处理
- 后端真实 API 对接
- 生产部署配置

---

*本文档由 GitHub Copilot CLI 辅助生成，基于 需求背景.md + 业务样本数据 + UI UX Pro Max 设计规范*
