"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Code2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 居中径向光晕 */}
      <div className="absolute inset-0 tech-glow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 顶部标签 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>欢迎来到我的数字世界</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">你好，我是</span>
            <br />
            <span className="text-foreground">开发者</span>
            <span className="inline-block ml-2 animate-pulse text-primary">_</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            一名全栈开发者 &amp; 技术写作者。热爱用代码构建优雅的解决方案，
            <br className="hidden md:block" />
            在这里分享我的技术探索、项目经验与思考。
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/blog">
              <Button size="lg" className="group">
                <Code2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                探索博客
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="group">
                <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                了解更多
              </Button>
            </Link>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: "50+", label: "技术文章" },
              { value: "8+", label: "年开发经验" },
              { value: "30+", label: "开源项目" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 向下滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">向下滚动</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
