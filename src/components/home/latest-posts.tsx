"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface LatestPostsProps {
  posts: PostMeta[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            <Tag className="w-4 h-4" />
            <span>最新文章</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">技术</span>随笔
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            记录技术探索与思考
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="glass-card rounded-xl overflow-hidden h-full group hover:scale-[1.02] transition-transform cursor-pointer">
                  {/* 封面区域 */}
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

                  {/* 内容区域 */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-all group">
              查看全部文章
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
