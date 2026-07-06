---
title: 用 Obsidian 写博客的最佳实践
date: 2025-01-10
excerpt: 分享如何将 Obsidian 作为博客写作的首选工具，以及如何让 Obsidian 笔记无缝同步到博客系统。
tags:
  - Obsidian
  - 写作
  - 效率
category: 效率
published: true
---

# 用 Obsidian 写博客的最佳实践

Obsidian 是目前最强大的本地 Markdown 笔记工具之一。本文将分享如何将它作为博客写作的终极工具。

## 为什么选择 Obsidian？

- ==本地优先==：所有数据存在本地，完全掌控
- ==双链笔记==：知识网络化管理
- ==丰富的插件生态==：高度可定制
- ==所见即所得==：实时预览编辑

## 文件管理最佳实践

推荐的 Obsidian Vault 结构：

```
MyVault/
├── 📁 Blog/              ← 博客文章目录
│   ├── 📁 posts/         ← 已发布文章
│   ├── 📁 drafts/        ← 草稿
│   └── 📁 templates/     ← 模板
├── 📁 Images/            ← 图片资源
├── 📁 Attachments/       ← 附件（视频等）
├── 📁 Knowledge/         ← 知识库
└── 📁 Daily/             ← 日记
```

> [!note] 同步方案
> 将 Obsidian Vault 中的 `Blog/posts/` 目录软链接到博客项目的 `content/posts/` 目录，即可实现无缝同步。

## Frontmatter 模板

每篇博客文章都应包含以下 Frontmatter：

```yaml
---
title: 文章标题
date: 2025-01-10
excerpt: 文章摘要，显示在列表中
tags:
  - 标签1
  - 标签2
category: 分类名
cover: https://example.com/cover.jpg
published: true
---
```

> [!tip] 快速模板
> 在 Obsidian 中使用模板插件，可以一键插入 Frontmatter，节省大量时间。

## Obsidian 语法兼容性

本博客系统完全兼容以下 Obsidian 语法：

### 双链笔记

在 Obsidian 中使用 `[[笔记名]]` 创建双链，发布到博客后会自动转换为文章链接。

### 嵌入资源

使用 `![[文件名]]` 嵌入图片、视频等资源：

- `![[screenshot.png]]` → 图片
- `![[demo.mp4]]` → 视频
- `![[audio.mp3]]` → 音频

### Callout 提示框

```
> [!note] 标题
> 内容
```

支持的类型：`note`、`tip`、`warning`、`danger`、`info`、`quote`

### 高亮文本

使用 `==高亮内容==` 标记重要信息。

## 写作工作流

推荐的写作流程：

1. **构思阶段**：在 `drafts/` 目录创建草稿
2. **写作阶段**：使用 Obsidian 编辑器专注写作
3. **配图阶段**：拖拽图片到 Obsidian，自动嵌入
4. **审阅阶段**：使用阅读模式预览效果
5. **发布阶段**：填写 Frontmatter，移动到 `posts/` 目录
6. **同步阶段**：文件自动同步到博客系统

> [!warning] 注意事项
> 发布前确保所有 `![[嵌入]]` 引用的文件都已放置在正确的资源目录中。

## 推荐插件

| 插件名 | 用途 | 推荐指数 |
|--------|------|----------|
| Templater | 模板管理 | ★★★★★ |
| Dataview | 数据查询 | ★★★★☆ |
| Kanban | 看板管理 | ★★★★☆ |
| Calendar | 日历视图 | ★★★★☆ |
| Mind Map | 思维导图 | ★★★☆☆ |

## 总结

Obsidian + 本博客系统 = 完美的技术写作工作流：

- ✅ 本地写作，隐私安全
- ✅ 双链管理知识网络
- ✅ 无缝同步到博客
- ✅ 完整的 Markdown 兼容
- ✅ 丰富的交互功能

> [!tip] 开始尝试
> 如果你是 Obsidian 新手，建议先从简单笔记开始，逐步探索双链和插件功能。

---

你用什么工具写博客？欢迎在评论区分享你的工作流！
