"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Download,
  Code2,
  BookOpen,
  Heart,
  Coffee,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const profiles = [
  { icon: Mail, label: "邮箱", value: "hello@techblog.com", href: "mailto:hello@techblog.com" },
  { icon: Github, label: "GitHub", value: "github.com/yourname", href: "https://github.com" },
  { icon: MapPin, label: "位置", value: "中国 · 上海", href: null },
];

const aboutText = [
  "你好！我是一名热爱技术的全栈开发者。从 2018 年开始编程之旅，我始终相信代码不仅仅是工具，更是一种创造艺术的方式。",
  "我专注于 Web 开发和系统架构，对前端体验有极致的追求，同时也深谙后端服务的性能优化。日常工作之外，我喜欢在博客上分享技术见解，参与开源社区贡献，偶尔也会写一些关于技术成长的随笔。",
  "如果你对我的文章感兴趣，或者有合作意向，欢迎通过下方的方式联系我。让我们一起用代码改变世界！",
];

const funFacts = [
  { icon: Coffee, label: "咖啡杯数", value: "∞" },
  { icon: Code2, label: "代码行数", value: "100K+" },
  { icon: BookOpen, label: "读过书籍", value: "50+" },
  { icon: Heart, label: "开源 Stars", value: "2K+" },
];

const techStack = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Go",
  "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Tailwind CSS",
  "GraphQL", "tRPC", "Prisma", "Vercel",
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* 头像 */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl shadow-primary/20">
              <Terminal className="w-16 h-16" />
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-primary/20 blur-xl -z-10 animate-glow-pulse" />
          </div>

          {/* 基本信息 */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
              关于我
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              全栈开发者 · 技术写作者 · 开源爱好者
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {profiles.map((p) => (
                <div key={p.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p.icon className="w-4 h-4 text-primary" />
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      {p.value}
                    </a>
                  ) : (
                    <span>{p.value}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center md:justify-start">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                下载简历
              </Button>
            </div>
          </div>
        </div>

        {/* 自我介绍 */}
        <div className="glass-card rounded-xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">个人简介</h2>
          </div>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            {aboutText.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* 趣味统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {funFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <fact.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold gradient-text">{fact.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{fact.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 技术栈 */}
        <div className="glass-card rounded-xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">技术栈</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">让我们一起创造些什么</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            无论是技术交流、项目合作还是随便聊聊，我都很乐意收到你的消息
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="mailto:hello@techblog.com">
                <Mail className="w-4 h-4" />
                联系我
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
