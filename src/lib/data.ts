import fs from "fs";
import path from "path";
import { kv } from "@vercel/kv";

const dataDir = path.join(process.cwd(), "data");

export interface Comment {
  id: string;
  slug: string;
  name: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

export interface ViewCount {
  slug: string;
  count: number;
}

/**
 * 检测是否在 Vercel 生产环境（KV 可用）
 */
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ============ 本地文件存储（开发环境 fallback） ============

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readLocalComments(): Comment[] {
  ensureDataDir();
  const commentsPath = path.join(dataDir, "comments.json");
  if (!fs.existsSync(commentsPath)) {
    fs.writeFileSync(commentsPath, "[]");
    return [];
  }
  const data = fs.readFileSync(commentsPath, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalComments(comments: Comment[]) {
  ensureDataDir();
  const commentsPath = path.join(dataDir, "comments.json");
  fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
}

function readLocalViews(): ViewCount[] {
  ensureDataDir();
  const viewsPath = path.join(dataDir, "views.json");
  if (!fs.existsSync(viewsPath)) {
    fs.writeFileSync(viewsPath, "[]");
    return [];
  }
  const data = fs.readFileSync(viewsPath, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalViews(views: ViewCount[]) {
  ensureDataDir();
  const viewsPath = path.join(dataDir, "views.json");
  fs.writeFileSync(viewsPath, JSON.stringify(views, null, 2));
}

// ============ 统一数据接口（KV 优先，本地 fallback） ============

/** 获取某篇文章的评论 */
export async function getComments(slug: string): Promise<Comment[]> {
  if (isKVAvailable()) {
    const comments = (await kv.get<Comment[]>(`comments:${slug}`)) || [];
    return comments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // 本地模式
  const comments = readLocalComments();
  return comments
    .filter((c) => c.slug === slug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** 添加评论 */
export async function addComment(
  slug: string,
  name: string,
  content: string
): Promise<Comment> {
  const newComment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slug,
    name: name.trim().slice(0, 50),
    content: content.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  if (isKVAvailable()) {
    const existing = (await kv.get<Comment[]>(`comments:${slug}`)) || [];
    existing.push(newComment);
    await kv.set(`comments:${slug}`, existing);
    return newComment;
  }

  // 本地模式
  const comments = readLocalComments();
  comments.push(newComment);
  writeLocalComments(comments);
  return newComment;
}

/** 获取浏览次数 */
export async function getViews(slug: string): Promise<number> {
  if (isKVAvailable()) {
    const count = (await kv.get<number>(`views:${slug}`)) || 0;
    return count;
  }

  // 本地模式
  const views = readLocalViews();
  const entry = views.find((v) => v.slug === slug);
  return entry?.count || 0;
}

/** 增加浏览次数 */
export async function incrementViews(slug: string): Promise<number> {
  if (isKVAvailable()) {
    const count = await kv.incr(`views:${slug}`);
    return count;
  }

  // 本地模式
  const views = readLocalViews();
  const entry = views.find((v) => v.slug === slug);
  if (entry) {
    entry.count += 1;
  } else {
    views.push({ slug, count: 1 });
  }
  writeLocalViews(views);
  return entry?.count || 1;
}

/** 获取总浏览量 */
export async function getTotalViews(): Promise<number> {
  if (isKVAvailable()) {
    // KV 模式：用 keys 方法获取所有 views 前缀的 key 并求和
    const keys = await kv.keys("views:*");
    let total = 0;
    for (const key of keys) {
      const val = await kv.get<number>(key);
      if (val) total += val;
    }
    return total;
  }

  // 本地模式
  const views = readLocalViews();
  return views.reduce((sum, v) => sum + v.count, 0);
}
