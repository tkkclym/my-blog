---
title: 欢迎来到我的技术博客
date: 2024-12-01
excerpt: 这是博客的第一篇文章，介绍这个博客系统的功能特性，包括 Obsidian 兼容、评论系统、浏览统计等。
tags:
  - 博客
  - Next.js
  - Obsidian
category: 技术
cover: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop
published: true
---

# 欢迎来到我的技术博客

这是一个基于 **Next.js 15 + React 19 + Tailwind CSS + shadcn/ui** 构建的现代博客系统，完全兼容 Obsidian Markdown 语法。

## 核心特性

### 1. Obsidian 语法兼容

这个博客系统支持 Obsidian 的所有核心 Markdown 扩展语法：

- `[[双链笔记]]` — 自动转换为博客内链接
- `![[图片嵌入]]` — 直接嵌入图片资源
- `> [!note]` — Obsidian Callout 提示框
- `==高亮文本==` — 行内高亮标记

### 2. 富媒体支持

你可以在文章中嵌入多种媒体类型：

- 图片（PNG、JPG、GIF、WebP、SVG）
- 视频（MP4、WebM）
- 音频（MP3、WAV）
- 代码高亮

### 3. 交互功能

每篇文章都支持：

- 浏览次数统计
- 评论互动
- 阅读时间估算
- 标签和分类筛选

## Obsidian Callout 示例

> [!note] 笔记
> 这是一个 Note 类型的提示框，用于补充说明重要信息。

> [!tip] 提示
> 这是一个 Tip 类型的提示框，用于分享小技巧。

> [!warning] 警告
> 这是一个 Warning 类型的提示框，用于提醒注意事项。

> [!danger] 危险
> 这是一个 Danger 类型的提示框，用于标注高风险操作。

## 代码高亮

```typescript
interface BlogPost {
  title: string;
  date: Date;
  content: string;
  tags: string[];
}

function createPost(data: Partial<BlogPost>): BlogPost {
  return {
    title: data.title || "Untitled",
    date: data.date || new Date(),
    content: data.content || "",
    tags: data.tags || [],
  };
}
```

```python
def fibonacci(n: int) -> list[int]:
    """生成斐波那契数列"""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    seq = [0, 1]
    for i in range(2, n):
        seq.append(seq[i-1] + seq[i-2])
    return seq

# 使用示例
print(fibonacci(10))
# 输出: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## 表格示例

| 技术栈 | 用途 | 熟练度 |
|--------|------|--------|
| Next.js | 前端框架 | ★★★★★ |
| TypeScript | 类型系统 | ★★★★★ |
| Tailwind CSS | 样式方案 | ★★★★☆ |
| PostgreSQL | 数据库 | ★★★★☆ |

## 引用与高亮

这是一段普通文本，其中包含 ==高亮的重要信息==，以及行内代码 `console.log("hello")`。

> 好的代码是自己最好的文档。当你打算加注释时，问问自己："如何改进代码让它不需要注释？"
> 
> — Steve McConnell

## 列表示例

### 无序列表

- 第一项内容
- 第二项内容
  - 嵌套子项 A
  - 嵌套子项 B
- 第三项内容

### 有序列表

1. 第一步：安装依赖
2. 第二步：配置环境变量
3. 第三步：启动开发服务器
4. 第四步：开始编写文章

---

如果你喜欢这个博客系统，欢迎在评论区留言交流！
