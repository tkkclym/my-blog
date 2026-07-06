# 🚀 Vercel 部署指南

本指南将帮助你把博客部署到 Vercel，让全世界通过 HTTP 访问你的网站。

---

## 前置条件

- [GitHub](https://github.com) 账号（免费）
- [Vercel](https://vercel.com) 账号（可用 GitHub 登录，免费）

---

## 第一步：推送代码到 GitHub

### 方法 A：用 GitHub 网页端创建（最简单）

1. 打开 https://github.com/new
2. Repository name 填 `my-blog`
3. 选择 **Public**（公开，Vercel 免费版需要公开仓库）
4. **不要**勾选 "Add a README file"
5. 点击 **Create repository**

### 方法 B：用 GitHub CLI（命令行）

```bash
# 安装 GitHub CLI（如果没装）
# Windows: winget install GitHub.cli
# Mac: brew install gh

# 登录并创建仓库
gh auth login
gh repo create my-blog --public --source=. --push
```

### 推送代码

创建好仓库后，在你的项目目录执行：

```bash
cd "你的项目路径"

# 关联远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/my-blog.git

# 重命名分支为 main
git branch -M main

# 推送
git push -u origin main
```

---

## 第二步：在 Vercel 导入项目

1. 打开 https://vercel.com/new
2. 选择你的 GitHub 账号，找到 `my-blog` 仓库
3. 点击 **Import**
4. Vercel 会自动识别为 Next.js 项目，**不需要改任何配置**
5. 直接点击 **Deploy**

等待 1-2 分钟，部署完成后你会获得一个链接：
```
https://my-blog-xxx.vercel.app
```

此时你的博客已经可以访问了！但评论和浏览统计还不会持久化（因为还没配数据库）。

---

## 第三步：创建 Vercel KV 数据库（让评论和浏览统计持久化）

1. 进入 Vercel 项目面板：https://vercel.com/dashboard
2. 点击你的 `my-blog` 项目
3. 顶部选择 **Storage** 标签
4. 点击 **Create Database** → 选择 **KV**
5. 数据库名称填 `blog-data`，点击 **Create**
6. 创建完成后，点击 **Connect to Project**
7. 选择你的 `my-blog` 项目，确认连接

连接后，Vercel 会自动注入这些环境变量（无需手动配置）：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_URL`
- `KV_TOKEN`

### 重新部署让环境变量生效

1. 进入项目的 **Deployments** 标签
2. 找到最新的部署，点击右侧 `...` → **Redeploy**
3. 等待部署完成

现在评论和浏览统计会持久化到 KV 数据库了！

---

## 第四步（可选）：绑定自定义域名

1. 在 Vercel 项目面板 → **Settings** → **Domains**
2. 输入你的域名（如 `blog.yourname.com`）
3. 按提示到域名服务商添加 DNS 记录：
   - 类型：`CNAME`
   - 名称：`blog`（或 `@`）
   - 值：`cname.vercel-dns.com`
4. 等待 DNS 生效（通常几分钟到几小时）
5. Vercel 会自动签发 HTTPS 证书

---

## 日常使用

### 发布新文章

在项目的 `content/posts/` 目录创建 `.md` 文件：

```markdown
---
title: 我的新文章
date: 2026-07-06
category: 随笔
tags: [生活, 思考]
excerpt: 这是文章摘要
cover: https://example.com/cover.jpg
---

正文内容，支持 Obsidian 语法...
```

提交并推送：

```bash
git add content/posts/我的新文章.md
git commit -m "post: 我的新文章"
git push
```

Vercel 会自动重新部署，新文章立即上线！

### Obsidian 同步

将 Obsidian Vault 中的博客文件夹软链接到项目的 `content/posts/`：

**Windows（管理员 CMD）：**
```cmd
mklink /D "项目路径\content\posts" "Obsidian库路径\Blog"
```

**Mac/Linux：**
```bash
ln -s "/path/to/obsidian/Blog" "/path/to/project/content/posts"
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（评论和浏览统计使用本地文件存储）
npm run dev

# 访问 http://localhost:3000
```

---

## 免费额度说明

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| Vercel Hobby | 100GB 带宽/月 | 个人博客绰绰有余 |
| Vercel KV | 256MB 存储 + 30,000 命令/月 | 评论和浏览统计够用 |
| GitHub | 无限公开仓库 | 免费 |

如果超出免费额度，可以考虑：
- 升级 Vercel Pro（$20/月）
- 或迁移到自建服务器（参考下方）

---

## 常见问题

### Q: 部署后评论不见了？
A: 检查是否已完成第三步（KV 数据库连接 + 重新部署）。

### Q: 如何迁移已有评论数据？
A: 本地 `data/` 目录下的 `comments.json` 和 `views.json` 包含历史数据，可手动导入 KV。

### Q: Vercel 访问不了？
A: 中国大陆访问 Vercel 可能需要绑定自定义域名 + CDN。

### Q: 想要自建服务器部署？
A: 使用 Docker 或 PM2 部署：
```bash
npm run build
npm run start  # 默认 3000 端口
# 配合 Nginx 反向代理 + 域名 + HTTPS
```
