# 销售智能体-设计规范

> 设计稿版本: 2026-05-15
> 规范维护: 联想中国区领域智能体设计团队

---

## 目录

1. [颜色规范](#1-颜色规范)
2. [字体规范](#2-字体规范)
3. [阴影规范](#3-阴影规范)
4. [布局规范](#4-布局规范)
5. [组件规范](#5-组件规范)
6. [图标规范](#6-图标规范)
7. [CSS变量参考](#7-css变量参考)
8. [附录](#附录)

---

## 1. 颜色规范

### 1.1 品牌色 (Brand)

| 编号 | 色值 | 状态 |
|------|------|------|
| Brand1-1 | `#E8F3FF` | 浅色背景 |
| Brand1-2 | `#BEDAFF` | 文字禁用 |
| Brand1-3 | `#94BFFF` | 禁用 |
| Brand1-4 | `#6AA1FF` | 特殊场景 |
| Brand1-5 | `#4080FF` | 悬浮 |
| Brand1-6 | `#2563EB` | 常规 |
| Brand1-7 | `#0E42D2` | 点击 |

### 1.2 功能色 (Functional)

#### Warning 警告色

| 编号 | 色值 | 状态 |
|------|------|------|
| Warning-6 | `#FF7D00` | 常规 |
| Warning-5 | `#FF9A2E` | 悬浮 |
| Warning-7 | `#D25F00` | 点击 |
| Warning-3 | `#FFCF8B` | 禁用 |

#### Success 成功色

| 编号 | 色值 | 状态 |
|------|------|------|
| Success-6 | `#00B42A` | 常规 |
| Success-5 | `#23C343` | 悬浮 |
| Success-7 | `#009A29` | 点击 |
| Success-3 | `#7BE188` | 禁用 |

#### Danger 错误色

| 编号 | 色值 | 状态 |
|------|------|------|
| Danger-6 | `#F53F3F` | 常规 |
| Danger-5 | `#F76560` | 悬浮 |
| Danger-7 | `#CB2634` | 点击 |
| Danger-3 | `#FBACA3` | 禁用 |

### 1.3 其他系统色

| 色系 | 常规 | 悬浮 | 点击 | 禁用 | 浅色背景 | 特殊场景 |
|------|------|------|------|------|----------|----------|
| **Orange Red 晚秋红** | #F77234 | #F99057 | #CC5120 | #FCC59F | #FFF3E8 | #FDDDC3 |
| **Gold** | #F7BA1E | #F9CC45 | #CC9213 | #FCE996 | #FFFCE8 | #FDF4BF |
| **Blue** | #3491FA | #57A9FB | #206CCF | #9FD4FD | #E8F7FF | #C3E7FE |
| **Purple** | #722ED1 | #8D4EDA | #551DB0 | #C396ED | #F5E8FF | #DDBEF6 |
| **Cyan 碧涛青** | #00B2E6 | #26C4E8 | #0086BF | #7DD4F2 | #E6F7FD | #B8E5F8 |

### 1.4 中性色

#### 文字色 (Text)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-text-1 | `#0F172A` | 强调/正文标题 |
| color-text-2 | `#626C7B` | 次强调 |
| color-text-3 | `#9CA3AF` | 次要信息 |
| color-text-4 | `#C9CDD4` | 置灰信息 |

#### 边框色 (Border)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-border-4 | `#86909C` | 重/按钮描边 |
| color-border-3 | `#C9CDD4` | 深/悬浮 |
| color-border-2 | `#E5E6EB` | 一般 |
| color-border-1 | `#F2F3F5` | 浅 |

#### 填充色 (Fill)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-fill-5 | `#5E6673` | 强调/图标 |
| color-fill-3 | `#E5E6EB` | 深/灰底悬浮 |
| color-fill-2 | `#F2F3F5` | 一般/白底悬浮 |
| color-fill-1 | `#F7F8FA` | 浅/禁用 |

---

## 2. 字体规范

### 2.1 字体家族

- **中文字体**: Lenovo China
- **英文字体**: Lenovo PRC Experience Design Center
- **备用字体**: system-ui, -apple-system, sans-serif

### 2.2 字号规范

| 字号 | 用途 |
|------|------|
| 56px | 运营标题-大 |
| 48px | 运营标题-中 |
| 36px | 标题-大 |
| 24px | 标题-中 |
| 20px | 标题-小 |
| 16px | 正文-大 |
| 14px | 正文-常规 |
| 12px | 最小文本 |

### 2.3 行高规范

| 场景 | 行高 |
|------|------|
| 标题 (36px以上) | 1.2 |
| 正文 (14-24px) | 1.5 |
| 辅助文字 (12px) | 1.6 |
| 按钮文字 | 1.0 |

---

## 3. 阴影规范

### 3.1 投影 (Drop Shadow)

| 编号 | 参数 | 效果 |
|------|------|------|
| shadow-菜单 | `x:0, y:8, blur:20, #000000, 10%` | 下拉菜单阴影 |
| shadow-卡片 | `x:0, y:4, blur:10, #000000, 10%` | 卡片阴影 |
| shadow-BackTop | `x:0, y:4, blur:10, #000000, 10%` | 返回顶部阴影 |

### 3.2 方向阴影 (Directional Shadow)

| 编号 | 参数 |
|------|------|
| shadow1-left | `x:-2, y:0, blur:5, #000000, 10%` |
| shadow1-right | `x:2, y:0, blur:5, #000000, 10%` |
| shadow1-down | `x:0, y:2, blur:5, #000000, 10%` |
| shadow1-left-up | `x:-2, y:-2, blur:5, #000000, 10%` |
| shadow1-right-up | `x:2, y:-2, blur:5, #000000, 10%` |

---

## 4. 布局规范

### 4.1 页面尺寸

| 参数 | 值 |
|------|------|
| 设计宽度 | 1440px |
| 侧边栏宽度 | 240px |
| 顶栏高度 | 56px |
| 安全边距 | 24px |

### 4.2 间距规范

| 名称 | 值 | 用途 |
|------|------|------|
| xs | 4px | 紧凑间距 |
| sm | 8px | 小间距 |
| md | 16px | 标准间距 |
| lg | 24px | 大间距 |
| xl | 32px | 区块间距 |
| xxl | 48px | 页面间距 |

### 4.3 圆角规范

| 组件 | 圆角值 |
|------|--------|
| 按钮/标签 | 4px |
| 输入框/下拉框 | 6px |
| 卡片 | 8px |
| 弹窗 | 16px |

---

## 5. 组件规范

### 5.1 按钮

#### 按钮尺寸

| 尺寸 | 高度 | 字号 |
|------|------|------|
| 大 | 36px | 16px |
| 中 | 32px | 14px |
| 小 | 24px | 12px |

#### 按钮状态

| 状态 | 背景色 | 文字色 |
|------|--------|--------|
| 常规 | Brand1-6 `#2563EB` | #FFFFFF |
| 悬浮 | Brand1-5 `#4080FF` | #FFFFFF |
| 点击 | Brand1-7 `#0E42D2` | #FFFFFF |
| 禁用 | Brand1-3 `#94BFFF` | #FFFFFF |

### 5.2 输入框

| 参数 | 值 |
|------|------|
| 高度 | 40px |
| 圆角 | 6px |
| 边框色 | color-border-2 `#E5E6EB` |
| 聚焦边框 | Brand1-6 `#2563EB` |

### 5.3 卡片

| 参数 | 值 |
|------|------|
| 背景色 | #FFFFFF |
| 圆角 | 8px |
| 阴影 | shadow-卡片 |
| 内边距 | 16px / 24px |

### 5.4 表面色

| 角色 | Token | 色值 | 用途 |
|------|-------|------|------|
| 页面背景 | `--color-bg-page` | `#FCFDFF` | 页面主背景 |
| 卡片表面 | `--color-bg-card` | `#FFFFFF` | 卡片、表单面板 |
| 分组背景 | `--color-bg-section` | `#F6F8FA` | 表头、分组背景 |

### 5.5 渐变色

| 状态 | Token | 值 |
|------|-------|-----|
| 默认态 | `--gradient-brand` | `linear-gradient(135deg, #8D64DD 0%, #206BFA 50%, #01A9EE 100%)` |
| Hover态 (+10%白) | `--gradient-brand-hover` | `linear-gradient(135deg, #A37EEB 0%, #4A8CFF 50%, #31B9F2 100%)` |
| Active态 (+10%黑) | `--gradient-brand-active` | `linear-gradient(135deg, #7F4CCB 0%, #1C5FDE 50%, #0198DA 100%)` |

### 5.6 状态标识

> 状态颜色统一使用销售智能体功能色体系

| 状态 | 图标颜色 | 色值来源 |
|------|---------|---------|
| 已完成 | `#00B42A` | Success-6 |
| 待运行 | `#2563EB` | Brand1-6 |
| 执行中 | `#4080FF` | Brand1-5 |
| 异常 | `#FF7D00` | Warning-6 |
| 停止 | `#9CA3AF` | text-3 |
| 运行失败 | `#F53F3F` | Danger-6 |

### 5.7 过渡与动效

| Token | 值 | 用途 |
|-------|-----|------|
| `--duration-fast` | 100ms | 微交互反馈：checkbox, radio, toggle |
| `--duration-normal` | 200ms | 组件状态切换：hover, active, focus |
| `--duration-slow` | 300ms | 布局变化：展开/收起 |
| `--duration-slower` | 400ms | 页面过渡：弹窗动画 |

| Token | 值 | 用途 |
|-------|-----|------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | 默认过渡 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 元素进入动画 |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 元素离开动画 |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 按钮点击弹性效果 |

### 5.8 按钮类型

> 按钮颜色统一使用销售智能体品牌色体系

| 按钮类型 | 默认状态 | Hover 状态 | Active 状态 |
|---------|---------|----------|---------|
| 实心主按钮 | `#2563EB` (Brand1-6) | `#4080FF` (Brand1-5) | `#0E42D2` (Brand1-7) |
| 描边按钮（加强） | `#2563EB` 边框 | `#4080FF` 边框 | `#0E42D2` 边框 |
| 描边按钮（普通） | `#C9CDD4` 边框 (border-3) | `#4080FF` 边框 | `#0E42D2` 边框 |
| 带框图标按钮 | `#0F172A` (text-1) | `#4080FF` (Brand1-5) | `#0E42D2` (Brand1-7) |
| 纯图标按钮 | `#9CA3AF` (text-3) | `#4080FF` (Brand1-5) | `#0E42D2` (Brand1-7) |
| 渐变按钮 | 渐变色 | 提亮渐变 | 压深渐变 |

### 5.9 搜索筛选区

| 属性 | 值 |
|------|-----|
| 搜索框宽度 | 280px |
| 搜索框高度 | 32px |
| 搜索框圆角 | 6px |
| 筛选下拉宽度 | 100px |

### 5.10 表格列表

| 属性 | 值 |
|------|-----|
| 表头背景 | `#F6F8FA` |
| 表头字号 | 12px |
| 表头字重 | 500 |
| 表体字号 | 12px |
| 分割线颜色 | `#F2F3F5` (border-1) |
| 行高 | 48px |
| 行 hover 背景 | `rgba(37, 99, 235, 0.04)` |

### 5.11 分页组件

| 属性 | 值 |
|------|-----|
| 页码按钮尺寸 | 32px × 32px |
| 页码按钮圆角 | 4px |
| 当前页背景 | `#2563EB` (Brand1-6) |
| 当前页文字 | `#FFFFFF` |
| 页码文字颜色 | `#626C7B` (text-2) |
| 每页条数选择器宽度 | 80px |
| 跳转输入框宽度 | 56px |

### 5.12 面包屑导航

| 角色 | 颜色 | 色值来源 |
|------|------|---------|
| 父级链接 | `#9CA3AF` | text-3 |
| 父级 hover | `#626C7B` | text-2 |
| 分隔符 `/` | `#9CA3AF` | text-3 |
| 当前页 | `#0F172A` | text-1 (字重600) |

### 5.13 下拉菜单

| 属性 | 值 |
|------|-----|
| 下拉菜单宽度 | 120px |
| 选项高度 | 32px |
| 选项 hover 背景 | `rgba(37, 99, 235, 0.1)` |

### 5.14 标签 Tag

| 属性 | 值 |
|------|-----|
| 标签字号 | 12px |
| 标签圆角 | 4px |
| 标签背景 | `#F3F5FB` |
| 标签文字 | `#0F172A` (text-1) |

---

## 6. 图标规范

> 图标总数: 196 个（从Figma设计稿导出）

### 6.1 图标分类

| 分类 | 数量 |
|------|------|
| ✏️ 编辑类 (edit) | 40 |
| ⚙️ 通用类 (general) | 80 |
| ➡️ 方向指示类 (direction) | 30 |
| 🖱️ 交互按钮类 (interactive-button) | 36 |
| 🎬 影音类 (media) | 10 |

### 6.2 ✏️ 编辑类图标 (Edit)

- `align-center`, `align-left`, `align-right`, `bg-colors`, `bold`, `brush`, `copy`, `delete`, `edit`, `eraser`, `filter`, `find-replace`, `font-colors`, `formula`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `h7`, `highlight`, `italic`, `line-height`, `oblique-line`, `ordered-list`, `original-size`, `paste`, `quote`, `redo`, `scissor`, `sort`, `sort-ascending`, `sort-descending`, `strikethrough`, `underline`, `undo`, `unordered-list`, `zoom-in`, `zoom-out`

### 6.3 ⚙️ 通用类图标 (General)

- `add`, `address`, `alarm`, `album`, `align-left`, `announcement`, `api`, `app`, `approve`, `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up`, `attachment`, `back`, `back-top`, `bar-chart`, `bell`, `block`, `book`, `branch`, `broadcast`, `brush`, `bug`, `build`, `bullet-list`, `business`, `calendar`, `camera`, `cancel`, `cart`, `category`, `chart`, `check`, `check-circle`, `checkout`, `city`, `close`, `code`, `collection`, `color`, `command`, `comment`, `comments`, `compress`, `config`, `copy`, `coupon`, `credit`, `dashboard`, `data`, `database`, `delete`, `department`, `deploy`, `desktop`, `development`, `dialogue`, `direct-notification`, `discount`, `distribution`, `domain`, `double-arrow-left`, `double-arrow-right`, `download`, `drag`, `drink`, `edit`, `education`, `eject`, `email`, `empty`, `endorsement`, `enter`, `enterprise`, `envelope`, `error`, `event`, `exit`, `expand`, `experience`, `export`, `eyes`, `face`, `favorites`, `feedback`, `field`, `file`, `file-add`, `file-code`, `file-common`, `file-copy`, `file-download`, `file-excel`, `file-exclamation`, `file-image`, `file-key`, `file-lock`, `file-minus`, `file-music`, `file-pdf`, `file-ppt`, `file-question`, `file-subtract`, `file-text`, `file-txt`, `file-upload`, `file-video`, `file-word`, `file-zip`, `filter`, `flag`, `flash`, `folder`, `folder-add`, `folder-close`, `folder-open`, `folder-upload`, `follow`, `footprint`, `fork`, `form`, `forward`, `fullscreen`, `fullscreen-exit`, `function`, `game`, `gift`, `global`, `group`, `halfscreen`, `hands-free`, `hardware`, `headset`, `help`, `history`, `home`, `honor`, `horn`, `host`, `house`, `idea`, `image`, `import`, `inbox`, `info`, `information`, `install`, `insurance`, `integral`, `integration`, `interactive`, `interface`, `invite`, `invoice`, `journal`, `keyboard`, `label`, `layer`, `layout`, `level`, `lightning`, `link`, `list`, `live`, `load`, `location`, `lock`, `log`, `loop`, `loyalty`, `mailand-notification`, `mall`, `manage`, `map`, `math`, `media`, `meeting`, `member`, `memory`, `menu`, `merchant`, `message`, `mic`, `microphone`, `minimize`, `minus`, `mobile`, `modification`, `more`, `move`, `multi-language`, `music`, `mutual`, `name-card`, `nav-menu`, `night`, `node`, `notification`, `office`, `offline`, `online`, `open`, `operate`, `order`, `organization`, `other`, `outbox`, `outline`, `package`, `page`, `page-first`, `page-last`, `page-next`, `page-prior`, `palette`, `parent`, `password`, `pay`, `payee`, `people`, `percent`, `person`, `phone`, `picture`, `pie-chart`, `pin`, `play`, `plus`, `policy`, `position`, `power`, `precise-select`, `print`, `product`, `profile`, `prompt`, `properties`, `public`, `purchase`, `puzzle`, `question`, `queue`, `radio-button`, `receipt`, `refresh`, `remind`, `remote-control`, `report`, `return`, `review`, `reviewer`, `risk`, `rocket`, `root`, `rotate`, `save`, `scan`, `scanner`, `search`, `security`, `select`, `selection`, `send`, `service`, `setting`, `setup`, `share`, `shield`, `shift`, `shopping`, `shortcut`, `shrink`, `sign`, `sign-in`, `sign-out`, `size`, `skin`, `skip-back`, `skip-forward`, `slice`, `slide`, `smart`, `sms`, `software`, `sort`, `sound`, `source`, `statistics`, `stop`, `store`, `strategy`, `stream`, `subscribe`, `subtitles`, `success`, `suggest`, `sum`, `supervisor`, `support`, `switch`, `switch-user`, `synchronization`, `system`, `system-error`, `table`, `tablet`, `tag`, `target`, `task`, `team`, `tel`, `temperature`, `template`, `text`, `text-recognition`, `theft`, `theme`, `ticket`, `time`, `timeline`, `tool`, `tooling`, `tools`, `top`, `tourism`, `transfer`, `trash`, `turn-off`, `umbrella`, `underway`, `undo`, `unlock`, `unpin`, `unsubscribe`, `upload`, `url`, `user`, `user-add`, `user-group`, `user-minus`, `user-profile`, `user-search`, `usergroup`, `vector`, `version`, `video`, `view`, `vip`, `visual`, `voice`, `volume`, `wallet`, `warning`, `weather`, `web`, `webcam`, `website`, `wifi`, `workflow`, `work`, `write`, `wrong`

### 6.4 ➡️ 方向指示类图标 (Direction)

- `arrow-down`, `arrow-enter`, `arrow-exit`, `arrow-left`, `arrow-left-down`, `arrow-left-up`, `arrow-return`, `arrow-right`, `arrow-right-down`, `arrow-right-up`, `arrow-shrink`, `arrow-up`, `back`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `double-arrow-down`, `double-arrow-left`, `double-arrow-right`, `double-arrow-up`, `down`, `enter`, `exit`, `fullscreen-down`, `fullscreen-left`, `fullscreen-right`, `fullscreen-up`, `left`, `pull`, `push`, `right`, `scroll-bar`, `shrink`, `sort`, `turn-down`, `turn-left`, `turn-right`, `turn-up`, `up`, `upload`

### 6.5 🖱️ 交互按钮类图标 (Interactive Button)

- `account-setting`, `add-circle`, `add-text`, `address`, `airplane`, `all`, `announcement`, `apps`, `arrow-circle-down`, `arrow-circle-left`, `arrow-circle-right`, `arrow-circle-up`, `attachment`, `bell`, `bird`, `block`, `brightness`, `calculator`, `calendar`, `camera`, `cancel-circle`, `category`, `chart-pie`, `check-circle`, `circle`, `close-circle`, `code`, `command`, `comment-circle`, `copy`, `cut`, `dashboard`, `delete`, `delete-circle`, `delete-file`, `delete-key`, `delete-link`, `delete-text`, `discount-circle`, `doubt`, `download`, `drag`, `edit-circle`, `effect`, `email`, `enlarge`, `error-circle`, `exchange`, `export`, `eye`, `eye-close`, `filter`, `filter-circle`, `find`, `flag-circle`, `folder`, `folder-open`, `fullscreen`, `glasses`, `grid`, `group`, `heart`, `help-circle`, `history`, `home`, `import`, `inbox`, `info-circle`, `key`, `keyboard`, `layers`, `link`, `link-circle`, `list`, `location`, `lock`, `lock-circle`, `log`, `log-in`, `log-out`, `magnifier`, `mail`, `mark`, `menu`, `minus-circle`, `more`, `more-circle`, `move`, `music`, `notification`, `offer`, `order`, `organization`, `paste`, `pause-circle`, `pen`, `people`, `people-plus`, `person`, `phone-call`, `phone-outgoing`, `pin`, `play-circle`, `plus-circle`, `point`, `power`, `print`, `promotion`, `question-circle`, `redo`, `refresh`, `repeat`, `repeat-circle`, `replace`, `report`, `retry`, `return`, `review`, `rig`, `rocket`, `save`, `scan`, `screen`, `search`, `setting`, `share`, `share-circle`, `shrink`, `sign-in`, `sign-out`, `signal`, `sort`, `sorting`, `sound`, `sponsor`, `star`, `sticky-note`, `stop-circle`, `store`, `subscribe`, `success-circle`, `sync`, `system`, `table`, `text`, `thumbs-down`, `thumbs-up`, `tool`, `transfer`, `trash`, `turn-off`, `undo`, `unlock`, `unpin`, `unsubscribe`, `upload`, `upload-circle`, `user`, `user-add`, `user-circle`, `user-minus`, `user-profile`, `user-setting`, `vip`, `voice`, `volume`, `warn`, `warning-circle`, `wifi`, `wifi-circle`, `work`, `zoom-in`, `zoom-out`

### 6.6 🎬 影音类图标 (Media)

- `airplay`, `album`, `backward`, `camera`, `camera-fill`, `end`, `fast-backward`, `fast-forward`, `forward`, `fullscreen`, `fullscreen-exit`, `go-on`, `headset`, `image`, `keep`, `live`, `loop`, `mic`, `microphone`, `mute`, `notification`, `pause`, `pause-circle`, `photo`, `picture`, `play`, `play-circle`, `play-circle-outline`, `playlist`, `poster`, `record`, `repeat`, `repeat-once`, `restart`, `rewind`, `scan`, `skip-back`, `skip-forward`, `sound`, `speaker`, `speech`, `stop`, `stop-circle`, `subtitles`, `synchronization`, `video`, `video-clip`, `video-file`, `voice`, `volume`, `volume-mute`, `volume-small`

---

## 7. CSS变量参考

### 7.1 完整 CSS Variables

```css
:root {
  /* ==================== 品牌色 ==================== */
  --brand-6: #2563EB;      /* 主色调 */
  --brand-5: #4080FF;      /* 悬浮 */
  --brand-7: #0E42D2;      /* 点击 */
  --brand-4: #6AA1FF;      /* 特殊场景 */
  --brand-3: #94BFFF;      /* 禁用 */
  --brand-2: #BEDAFF;      /* 文字禁用 */
  --brand-1: #E8F3FF;      /* 浅色背景 */

  /* ==================== 功能色 ==================== */
  --warning-6: #FF7D00;
  --warning-5: #FF9A2E;
  --warning-7: #D25F00;
  --warning-3: #FFCF8B;

  --success-6: #00B42A;
  --success-5: #23C343;
  --success-7: #009A29;
  --success-3: #7BE188;

  --danger-6: #F53F3F;
  --danger-5: #F76560;
  --danger-7: #CB2634;
  --danger-3: #FBACA3;

  /* ==================== 中性色 ==================== */
  --text-1: #0F172A;
  --text-2: #626C7B;
  --text-3: #9CA3AF;
  --text-4: #C9CDD4;

  --border-4: #86909C;
  --border-3: #C9CDD4;
  --border-2: #E5E6EB;
  --border-1: #F2F3F5;

  --fill-5: #5E6673;
  --fill-3: #E5E6EB;
  --fill-2: #F2F3F5;
  --fill-1: #F7F8FA;

  /* ==================== 阴影 ==================== */
  --shadow-menu: 0 8px 20px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 4px 10px rgba(0, 0, 0, 0.1);

  /* ==================== 间距 ==================== */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* ==================== 圆角 ==================== */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 16px;

  /* ==================== 渐变色 ==================== */
  --gradient-brand: linear-gradient(135deg, #8D64DD 0%, #206BFA 50%, #01A9EE 100%);
  --gradient-brand-hover: linear-gradient(135deg, #A37EEB 0%, #4A8CFF 50%, #31B9F2 100%);
  --gradient-brand-active: linear-gradient(135deg, #7F4CCB 0%, #1C5FDE 50%, #0198DA 100%);

  /* ==================== 表面色 ==================== */
  --color-bg-page: #FCFDFF;
  --color-bg-card: #FFFFFF;
  --color-bg-section: #F6F8FA;

  /* ==================== 状态色 ==================== */
  --color-status-pending: #2563EB;    /* 待运行 - Brand1-6 */
  --color-status-running: #4080FF;     /* 执行中 - Brand1-5 */
  --color-status-stopped: #9CA3AF;     /* 停止 - text-3 */
  --color-status-failed: #F53F3F;      /* 运行失败 - Danger-6 */
  --color-status-abnormal: #FF7D00;    /* 异常 - Warning-6 */
  --color-status-success: #00B42A;     /* 已完成 - Success-6 */

  /* ==================== 过渡 ==================== */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ==================== 组件尺寸 ==================== */
  /* 按钮 */
  --btn-height: 32px;
  --btn-height-lg: 36px;
  --btn-height-sm: 24px;
  --btn-padding-x: 12px;
  --btn-radius: 4px;

  /* 输入框 */
  --input-height: 40px;
  --input-radius: 6px;

  /* 下拉菜单 */
  --dropdown-width: 120px;
  --dropdown-option-height: 32px;
  --dropdown-hover-bg: rgba(37, 99, 235, 0.1);

  /* 标签 */
  --tag-font-size: 12px;
  --tag-radius: 4px;
  --tag-bg: #F3F5FB;
  --tag-text: #0F172A;

  /* ==================== 导航 ==================== */
  --sidebar-width-collapsed: 88px;
  --sidebar-width-expanded: 180px;
  --sidebar-width: 240px;
  --nav-primary-width: 72px;
  --nav-primary-height: 52px;
  --header-height: 56px;
}
```

---

## 附录

### A. 状态编号说明

| 编号 | 含义 |
|------|------|
| -6 | 常规状态 |
| -5 | 悬浮 (hover) |
| -7 | 点击 (active) |
| -3 | 禁用 (disabled) |
| -1 | 浅色背景 |
| -2 | 特殊场景 |

### B. 色彩对比度要求

- 正文与背景: ≥ 4.5:1
- 大文本与背景: ≥ 3:1

### C. 图标目录

图标文件位于 `icons/` 目录下，命名规则：`{category}_{icon-name}.png`

