import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { processObsidianSyntax } from "./obsidian";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  category?: string;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;
  contentHtml: string;
  readingTime: number;
}

/** 确保目录存在，不存在则创建 */
function ensureDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

/** 获取所有文章的元数据 */
export function getAllPosts(): PostMeta[] {
  ensureDirectory();

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, file);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || data.description || "",
      tags: data.tags || [],
      cover: data.cover || data.image || undefined,
      category: data.category || "随笔",
      published: data.published !== false,
    } as PostMeta;
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** 根据 slug 获取单篇文章 */
export function getPostBySlug(slug: string): Post | null {
  ensureDirectory();

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  // 处理 Obsidian 语法
  const processedContent = processObsidianSyntax(content);

  // 计算阅读时间
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    excerpt: data.excerpt || data.description || "",
    tags: data.tags || [],
    cover: data.cover || data.image || undefined,
    category: data.category || "随笔",
    published: data.published !== false,
    content: processedContent,
    contentHtml: "", // 将在渲染时动态生成
    readingTime,
  };
}

/** 获取所有标签 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/** 获取所有分类 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const catSet = new Set<string>();
  posts.forEach((p) => p.category && catSet.add(p.category));
  return Array.from(catSet).sort();
}
