import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Tag, ChevronLeft, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { CommentSection } from "@/components/blog/comment-section";
import { ViewCounter } from "@/components/blog/view-counter";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getViews, getComments } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: `${post.title} | TechBlog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const views = await getViews(slug);
  const commentCount = (await getComments(slug)).length;

  // 获取上一篇/下一篇文章
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <article className="container mx-auto px-4 py-12 md:py-20">
      {/* 返回按钮 */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        返回博客列表
      </Link>

      {/* 文章头部 */}
      <header className="max-w-3xl mx-auto mb-12">
        {/* 分类和标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="default" className="text-xs">
            {post.category}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight gradient-text">
          {post.title}
        </h1>

        {/* 摘要 */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            阅读约 {post.readingTime} 分钟
          </span>
          <ViewCounter slug={slug} initialCount={views} />
        </div>
      </header>

      {/* 封面图 */}
      {post.cover && (
        <div className="max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="max-w-3xl mx-auto">
        <MarkdownRenderer content={post.content} />

        <Separator className="my-12" />

        {/* 上一篇/下一篇 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`}>
              <div className="glass-card rounded-xl p-5 group hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  上一篇
                </div>
                <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {prevPost.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`}>
              <div className="glass-card rounded-xl p-5 group hover:scale-[1.02] transition-transform text-right">
                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mb-2">
                  下一篇
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
                <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {nextPost.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* 评论区 */}
        <CommentSection slug={slug} />
      </div>
    </article>
  );
}
