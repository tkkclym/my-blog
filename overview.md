# TechBlog — 个人技术博客系统

## 项目概述

一个基于 Next.js 15 + React 19 + TypeScript + Tailwind CSS + shadcn/ui 的现代个人博客系统，采用绿色科技主题，完全兼容 Obsidian Markdown 语法。

## 核心功能

### 1. 博客系统
- 文章列表页：支持搜索、分类筛选、标签筛选
- 文章详情页：Markdown 渲染、代码高亮、封面图、上下篇导航
- Obsidian 兼容：双链 `[[...]]`、嵌入 `![[...]]`、Callout `> [!note]`、高亮 `==...==`

### 2. 交互功能
- 浏览次数统计（Vercel KV 持久化，开发环境用本地文件）
- 评论系统（发表/展示评论，Vercel KV 存储）

### 3. 个人主页
- Hero 动画区域
- 技能展示卡片（6 大技术领域）
- 时间线履历展示（工作/教育/奖项）
- 最新文章预览

### 4. 关于页面
- 个人简介
- 趣味统计
- 技术栈展示
- 联系方式

### 5. 界面设计
- 绿色科技主题（emerald/teal 配色）
- 深色模式默认，支持 light/dark 切换
- Glassmorphism 玻璃拟态卡片
- 网格背景 + 浮动光球动画
- 渐变文字 + 发光效果
- 响应式 mobile-first 设计

## 目录结构

```
├── content/posts/           # Obsidian 兼容的 Markdown 博客文章
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # 首页
│   │   ├── blog/            # 博客页面
│   │   ├── about/           # 关于页面
│   │   └── api/             # API 路由（评论/浏览）
│   ├── components/
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── layout/          # 布局组件
│   │   ├── home/            # 首页组件
│   │   ├── blog/            # 博客组件
│   │   └── markdown/        # Markdown 渲染器
│   └── lib/                 # 工具库
│       ├── posts.ts         # 文章管理
│       ├── obsidian.ts      # Obsidian 语法兼容
│       ├── data.ts          # 评论/浏览数据
│       └── utils.ts         # 通用工具
└── data/                    # 运行时数据（自动创建）
```

## 如何添加博客文章

在 `content/posts/` 目录创建 `.md` 文件，格式如下：

```markdown
---
title: 文章标题
date: 2025-01-10
excerpt: 文章摘要
tags: [标签1, 标签2]
category: 分类名
cover: https://example.com/cover.jpg
published: true
---

正文内容...
```

### Obsidian 语法支持

| 语法 | 效果 |
|------|------|
| `[[笔记名]]` | 博客内链接 |
| `![[image.png]]` | 图片嵌入 |
| `![[video.mp4]]` | 视频嵌入 |
| `> [!note]` | Callout 提示框 |
| `==高亮==` | 行内高亮 |

## 运行命令

```bash
npm install      # 安装依赖
npm run dev      # 开发模式（本地文件存储）
npm run build    # 生产构建
npm run start    # 生产服务器
```

## 部署

详见 [DEPLOY.md](./DEPLOY.md)，核心步骤：

1. **推送 GitHub**：`git push` 到公开仓库
2. **Vercel 导入**：https://vercel.com/new 选择仓库，一键部署
3. **创建 KV 数据库**：Vercel Dashboard → Storage → Create KV → Connect
4. **重新部署**：让环境变量生效
5. **（可选）绑定域名**：Settings → Domains

部署后获得 `https://your-blog.vercel.app`，全世界可访问。

## 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS v3 + shadcn/ui
- **图标**: Lucide React
- **动画**: Framer Motion
- **Markdown**: react-markdown + remark/rehype 插件
- **字体**: Inter + JetBrains Mono
