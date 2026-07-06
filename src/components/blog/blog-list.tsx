"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, Tag, ArrowRight, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
  categories: string[];
}

export function BlogList({ posts, tags, categories }: BlogListProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchTag = !activeTag || post.tags.includes(activeTag);
      const matchCategory = !activeCategory || post.category === activeCategory;

      return matchSearch && matchTag && matchCategory;
    });
  }, [posts, search, activeTag, activeCategory]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* 页头 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          <span>博客文章</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
          <span className="gradient-text">所有</span>文章
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          共 {posts.length} 篇文章，记录技术探索与思考
        </p>
      </motion.div>

      {/* 搜索和过滤 */}
      <div className="max-w-4xl mx-auto mb-12 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索文章标题、摘要或标签..."
            className="pl-12 h-12 glass-card"
          />
        </div>

        {/* 分类过滤 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground mr-2">分类：</span>
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                !activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* 标签过滤 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground mr-2">标签：</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTag === tag
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 文章列表 */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center max-w-2xl mx-auto">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">没有找到匹配的文章</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setActiveTag(null);
              setActiveCategory(null);
            }}
          >
            清除筛选条件
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="glass-card rounded-xl overflow-hidden h-full group hover:scale-[1.02] transition-transform cursor-pointer">
                  {/* 封面 */}
                  {post.cover ? (
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center">
                      <div className="text-6xl font-bold text-primary/20">
                        {post.title.charAt(0)}
                      </div>
                      <div className="absolute inset-0 tech-grid-bg opacity-20" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 悬浮指示器 */}
                  <div className="px-6 pb-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读全文
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
