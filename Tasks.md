# 任务清单 (Tasks)

## Phase 1: 基础架构 (Infrastructure)
- [ ] **初始化**: React + Vite + Tailwind + TypeScript。
- [ ] **Shell**: 头部 Hero (计时器)，底部 FAB (提交入口)，空白时间轴容器。
- [ ] **工具**: `dateUtils` (1314天计算)。

## Phase 2: 内容提交系统 (Submission System)
- [ ] **PDF 解析**: 集成 `pdfjs-dist`，实现从 PDF 提取纯文本。
- [ ] **多模态输入框**: 
    - [ ] 文本域 (Text Area)。
    - [ ] 图片上传 (转 Base64 或 Blob URL 用于预览)。
    - [ ] 视频上传 (限制大小)。
- [ ] **鉴权**: 简单的密码保护 Modal。

## Phase 3: AI 智能设计师 (The AI Designer)
- [ ] **Gemini Client**: 配置 `@google/genai`。
- [ ] **Prompt Engineering**: 
    - [ ] 设计 Prompt 模板：“生成一段 HTML，包含这些图片... 风格为...”。
    - [ ] 调试 Prompt 以确保返回纯净的 HTML 且无 Markdown 标记。
- [ ] **生成流**: 连接输入框 -> Gemini -> 获取 HTML 字符串 -> 存入 State。

## Phase 4: 智能画布渲染 (Smart Canvas Rendering)
- [ ] **SmartCanvas 组件**: 
    - [ ] 实现一个安全的渲染容器 (使用 `dangerouslySetInnerHTML` 但经过 `DOMPurify` 清洗，或者使用 iframe)。
    - [ ] 设定 CSS 约束 (宽高、圆角、Overflow)。
- [ ] **时间轴集成**: 将 `SmartCanvas` 放入时间轴列表中。

## Phase 5: 优化 (Polish)
- [ ] **Loading 状态**: 这是一个异步过程，设计优美的 Loading 占位符。
- [ ] **移动端适配**: 测试 iPhone/Android 上的显示效果。
- [ ] **数据持久化**: 确保刷新页面后 HTML 内容不丢失 (LocalStorage)。
