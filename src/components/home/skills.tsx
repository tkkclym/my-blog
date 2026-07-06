"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  Terminal,
  Cpu,
  Palette,
  GitBranch,
  Boxes,
} from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "前端开发",
    desc: "React / Next.js / TypeScript / Tailwind CSS",
    color: "from-emerald-400 to-green-500",
    tags: ["React 19", "Next.js 15", "Vue 3", "TypeScript"],
  },
  {
    icon: Database,
    title: "后端开发",
    desc: "Node.js / Python / Go / PostgreSQL",
    color: "from-teal-400 to-emerald-500",
    tags: ["Node.js", "FastAPI", "Go", "PostgreSQL"],
  },
  {
    icon: Cloud,
    title: "云与运维",
    desc: "Docker / Kubernetes / CI/CD / AWS",
    color: "from-green-400 to-teal-500",
    tags: ["Docker", "K8s", "AWS", "Vercel"],
  },
  {
    icon: Palette,
    title: "设计 & UI/UX",
    desc: "Figma / 设计系统 / 动效设计",
    color: "from-lime-400 to-green-500",
    tags: ["Figma", "shadcn/ui", "Framer Motion", "CSS"],
  },
  {
    icon: Cpu,
    title: "AI & 机器学习",
    desc: "LLM 应用 / RAG / 向量数据库",
    color: "from-emerald-500 to-cyan-500",
    tags: ["LangChain", "OpenAI", "Pinecone", "PyTorch"],
  },
  {
    icon: GitBranch,
    title: "DevOps & 工具",
    desc: "Git / Linux / 监控 / 自动化",
    color: "from-green-500 to-emerald-600",
    tags: ["Git", "Linux", "Grafana", "Jenkins"],
  },
];

export function Skills() {
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
            <Boxes className="w-4 h-4" />
            <span>技术栈</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
            <span className="gradient-text">技能</span>与专长
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            多年技术沉淀，覆盖全栈开发的各个领域
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card rounded-xl p-6 group hover:scale-[1.02] transition-transform"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}
              >
                <skill.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {skill.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{skill.desc}</p>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
