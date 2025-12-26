# 项目文件结构 (File Structure)

```text
/
├── index.html
├── index.tsx
├── App.tsx
├── types.ts                # MemoryItem (with rawAssets & generatedHtml)
├── constants.ts
│
├── components/
│   ├── Layout/
│   │   ├── Header.tsx      # 倒计时 Hero
│   │   └── QuickNav.tsx
│   │
│   ├── Timeline/
│   │   ├── Timeline.tsx    # 列表容器
│   │   ├── TimelineNode.tsx# 单个时间节点 (包含日期和 Canvas)
│   │   └── SmartCanvas.tsx # 核心：渲染 AI 生成的 HTML
│   │
│   ├── Creator/            # 提交相关
│   │   ├── AuthGate.tsx
│   │   ├── CreatorModal.tsx
│   │   └── AssetInput.tsx  # 处理图/文/PDF输入
│   │
│   └── UI/
│       ├── Button.tsx
│       ├── Loader.tsx      # 生成中的动画
│       └── Modal.tsx
│
├── services/
│   ├── gemini.ts           # AI 生成 HTML 的逻辑
│   ├── pdf.ts              # PDF 文本提取
│   ├── storage.ts
│   └── date.ts
│
└── utils/
    ├── prompts.ts          # 存储发给 AI 的 System Instructions
    └── sanitizer.ts        # HTML 清洗工具
```
