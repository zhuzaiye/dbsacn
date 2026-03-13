# DBScan 项目状态报告

## 项目概述

DBScan 是一个基于 Vue 3 + Tauri 2.x 的企业级多数据库管理桌面应用，支持 MySQL、PostgreSQL、SQLite、SQL Server、ClickHouse 等主流数据库。

---

## 已完成功能点

### 1. 基础架构
- [x] Vue 3 + Composition API (`<script setup>`)
- [x] TypeScript 严格模式
- [x] Vite 7.x 构建系统
- [x] Tauri 2.x 桌面框架集成
- [x] Pinia 状态管理 (Setup Store 模式)
- [x] Naive UI 组件库

### 2. 布局系统
- [x] 三列自适应布局 (Sources | Editor+Results | Chat)
- [x] Naive UI n-split 分割面板
- [x] 顶部导航栏 (含菜单栏)
- [x] 底部状态栏
- [x] Dark/Light 主题切换

### 3. SQL 编辑器
- [x] Monaco Editor 集成
- [x] SQL 语法高亮
- [x] 多标签页管理 (创建/关闭/切换)
- [x] 内容修改状态追踪
- [x] 主题同步

### 4. 数据库连接管理
- [x] 连接列表 CRUD 操作
- [x] 搜索过滤功能
- [x] 树形结构展示 (Database/Table/Column)
- [x] 连接状态管理

### 5. 查询结果展示
- [x] Data 表格 (n-data-table + 虚拟滚动)
- [x] Logs 日志面板
- [x] Chart 预留位置

### 6. AI Chat 面板
- [x] 会话管理 (创建/删除/切换)
- [x] 消息展示 UI (user/assistant)
- [x] 认证状态管理

### 7. 查询历史
- [x] 历史记录存储 (最多 100 条)
- [x] 时间戳记录
- [x] 成功/失败状态追踪

### 8. 窗口控制
- [x] 最小化/最大化/关闭按钮
- [x] 可拖拽标题区域

---

## 技术债

### 1. 类型定义问题
- `DatabaseNode` 类型中 `metadata?.type` 在 SourcesPanel 中被使用，但类型定义不够完善
- 部分 store 使用 `any` 类型 (如 result store 中的 chartData)

### 2. 状态持久化缺失
- 数据库连接列表未持久化 (刷新丢失)
- 编辑器标签页内容未持久化
- 查询历史未持久化
- 主题设置未持久化

### 3. 代码重复
- `SourcesPanel.vue` 和 `SidebarContent.vue` 功能有重叠
- SourcesPanel 已有树形展示，但 SidebarContent 中又有独立的连接列表

### 4. 样式管理
- CSS 变量定义在多个地方 (main.css 和组件内)
- 存在未使用的样式代码

### 5. 错误处理
- 大部分 store 缺少输入验证
- 网络请求缺少错误边界

---

## TODO (未完成功能)

### 高优先级
- [ ] **数据库连接对话框** - 添加新连接的 UI 和表单验证
- [ ] **SQL 执行逻辑** - 连接数据库并执行查询的 Rust 后端
- [ ] **查询结果数据渲染** - 从后端获取真实数据
- [ ] **AI 后端对接** - Chat 面板与 Agnostic AI API 集成

### 中优先级
- [ ] **SQL 格式化** - 使用 sql-formatter 或类似库
- [ ] **复制到剪贴板** - 编辑器工具栏复制功能
- [ ] **强制执行 SQL** - 处理多条 SQL 语句
- [ ] **数据库节点点击事件** - SourcesPanel 树节点选择处理

### 低优先级
- [ ] **连接详情对话框** - 编辑/删除现有连接
- [ ] **图表可视化** - ResultChart 组件实现
- [ ] **查询导出** - 导出为 CSV/JSON
- [ ] **查询取消** - 取消正在执行的查询
- [ ] **首选项设置** - Tools > Preferences 对话框
- [ ] **文档/帮助** - Help 菜单功能
- [ ] **放大/缩小** - View 菜单缩放功能

### 基础设施
- [ ] 状态持久化 (localStorage / Tauri store)
- [ ] 单元测试 / E2E 测试
- [ ] 环境变量配置
- [ ] 日志系统完善

---

## 编码规范 (当前遵循)

1. **Vue 组件**: 使用 `<script setup lang="ts">` 语法
2. **导入路径**: 使用 `@/` 别名指向 `src/`
3. **Pinia Store**: Setup Store 模式 (`defineStore` + 函数式)
4. **命名规范**:
   - 组件: PascalCase
   - Store/Composables: camelCase
   - Types: PascalCase
5. **UI 框架**: Naive UI 组件，`n-` 前缀
6. **注释**: 代码中无注释 (按规范)

---

## 关键文件路径

| 模块 | 路径 |
|------|------|
| 入口 | `src/main.ts`, `src/App.vue` |
| Store | `src/stores/{layout,editor,database,chat,result}.ts` |
| 类型 | `src/types/*.ts` |
| 组件 | `src/components/{layout,editor,result,chat,sidebar}/*.vue` |
| Tauri 后端 | `src-tauri/src/{main,lib}.rs` |
| 配置 | `package.json`, `src-tauri/tauri.conf.json` |
