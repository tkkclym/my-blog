"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Code2, Zap, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [glitch, setGlitch] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 居中光晕 */}
      <div className="absolute inset-0 tech-glow" />

      <div className="container mx-auto px-6 relative z-10 py-24 md:py-0">
        <div className="max-w-5xl mx-auto">
          {/* 标签 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-primary/25 bg-primary/[0.04] text-primary text-sm tracking-wider mb-12 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="animate-flicker">欢迎来到我的数字世界</span>
          </motion.div>

          {/* 主标题 — 不对称左对齐 + glitch */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-8xl font-bold leading-[0.95] mb-8 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
            onMouseEnter={() => setGlitch(true)}
            onMouseLeave={() => setGlitch(false)}
          >
            <span className={glitch ? "animate-glitch inline-block" : ""}>
              <span className="gradient-text">Hello,</span>
              <br />
              <span className="text-foreground">
                I&lsquo;m a
              </span>{" "}
              <span className="text-primary glow-text relative">
                Developer
                <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-primary/60 rounded-full" />
              </span>
            </span>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-primary ml-1"
            >
              _
            </motion.span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
          >
            全栈开发者 &amp; 技术写作者。用代码构建优雅方案，
            <br />
            在这里分享探索、经验与思考。
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <Link href="/blog">
              <Button
                size="lg"
                className="group relative overflow-hidden text-base px-7 py-6 rounded-md"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  探索博客
                </span>
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="group text-base px-7 py-6 rounded-md border-border/60 hover:border-primary/40"
              >
                <Zap className="w-5 h-5 text-primary group-hover:scale-110 transition-transform mr-1" />
                了解更多
                <ArrowDownRight className="w-4 h-4 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </Link>
          </motion.div>

          {/* 统计数据 — 打破对称 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-1 max-w-lg"
          >
            {[
              { value: "50+", label: "技术文章" },
              { value: "8+", label: "年经验" },
              { value: "30+", label: "开源项目" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative group cursor-default"
              >
                {/* 左边线 */}
                <div className="absolute top-0 left-0 w-[1px] h-full bg-border/40 group-hover:bg-primary/60 transition-colors" />
                <div className="pl-5 py-3">
                  <div
                    className="text-4xl md:text-5xl font-bold text-primary group-hover:glow-text transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 底部滚动指示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-border/40">
            <motion.div
              className="w-full bg-primary/60 rounded-full"
              animate={{ height: ["20%", "60%", "20%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
