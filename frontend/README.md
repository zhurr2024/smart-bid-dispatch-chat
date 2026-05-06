# 智能标讯分发系统 — Smart Bid Dispatch Chat

PC端对话形式的智能标讯分发 SaaS 系统，前后端分离架构，使用 MSW 模拟接口。

## 技术栈
- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS v3
- **状态**: Zustand + TanStack Query v5
- **Mock**: MSW 2.x
- **图表**: Recharts
- **Excel**: xlsx + react-dropzone

## 快速启动

### 1. 进入前端目录
```bash
cd "D:\Program Files\FDE\Smart Bid Dispatch Chat\frontend"
```

### 2. 安装依赖
```bash
npm install
```

### 3. 初始化 MSW Service Worker（首次必须执行）
```bash
npx msw init public/ --save
```

### 4. 启动开发服务器
```bash
npm run dev
```

浏览器打开 http://localhost:5173 即可。

---

## Demo 账号（快捷登录）

| 角色 | 邮箱 | 说明 |
|------|------|------|
| 运营总部 (HQ_OPS) | zhang@company.com | 全量标讯、上传、分配 |
| 销管 (SALES_ADMIN) | zhao.sa@company.com | 华南大区标讯分配 |
| 大区Leader (REGION_LEADER) | sun.rl@company.com | 华南大区查看 |
| 客户经理 (AR) | wu.ar@company.com | 只看分配给自己的标讯 |

---

## 目录结构
```
src/
├── components/
│   ├── ui/           # 基础 UI 组件
│   ├── layout/       # AppLayout / Sidebar / TopBar
│   ├── chat/         # 对话主界面组件
│   ├── bid/          # 标讯详情/列表/筛选
│   ├── opportunity/  # 商机跟踪
│   ├── upload/       # 标讯上传
│   └── reports/      # 数据报表
├── hooks/            # TanStack Query hooks
├── mocks/            # MSW handlers + 模拟数据
├── pages/            # 页面
├── services/         # API 服务层
├── skills/           # 优先级分析 / 自动分发引擎
├── stores/           # Zustand 全局状态
└── types/            # TypeScript 类型定义
```

## 角色权限矩阵

| 功能 | HQ_OPS | SALES_ADMIN | TEAM_LEADER | REGION_LEADER | AR |
|------|--------|-------------|-------------|---------------|----|
| 标讯总览 | ✅ 全量 | ✅ 本大区 | ✅ 本团队 | ✅ 本大区 | ✅ 己分配 |
| 标讯分配 | ✅ | ✅ | ❌ | ❌ | ❌ |
| Excel上传 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 添加跟踪 | ❌ | ❌ | ✅ | ❌ | ✅ |
| 查看报表 | ✅ | ✅ | ✅ | ✅ | ✅ |
