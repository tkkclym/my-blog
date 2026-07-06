import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Tag, ChevronLeft, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { CommentSection } from "@/components/blog/comment-section";
import { ViewCounter } from "@/components/blog/view-counter";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getViews, getComments } from "@/lib/data";
import { extractToc } from "@/lib/toc";
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
  const tocItems = extractToc(post.content);

  // 获取上一篇/下一篇文章
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      {/* 移动端：顶部进度条 */}
      <ReadingProgress />

      {/* 返回按钮 */}
      <div className="container mx-auto px-4 pt-12 md:pt-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          返回博客列表
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {/* 双栏布局：TOC + 正文 */}
        <div className="flex gap-16">
          {/* ===== 左侧目录（PC） ===== */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />

              {/* 文章元信息 */}
              {tocItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground leading-relaxed">
                  <div>{formatDate(post.date)}</div>
                  <div className="mt-1">阅读约 {post.readingTime} 分钟</div>
                  <div className="mt-1">分类：{post.category}</div>
                </div>
              )}
            </div>
          </aside>

          {/* ===== 右侧正文 ===== */}
          <article className="flex-1 min-w-0 pb-20">
            {/* 文章头部 */}
            <header className="max-w-3xl mb-12">
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
              <div className="max-w-4xl mb-12 rounded-xl overflow-hidden border border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* 文章内容 */}
            <div className="max-w-3xl">
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
        </div>
      </div>
    </>
  );
}
