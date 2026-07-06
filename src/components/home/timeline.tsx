"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Rocket } from "lucide-react";

const timeline = [
  {
    year: "2024 — 至今",
    title: "高级全栈工程师",
    org: "科技公司",
    desc: "负责核心产品的架构设计与开发，带领团队构建高可用微服务系统，推进技术栈现代化升级。",
    icon: Rocket,
    type: "work",
  },
  {
    year: "2021 — 2024",
    title: "全栈开发工程师",
    org: "互联网企业",
    desc: "主导多个大型项目的前后端开发，搭建 CI/CD 流水线，性能优化使页面加载速度提升 60%。",
    icon: Briefcase,
    type: "work",
  },
  {
    year: "2020",
    title: "开源贡献者",
    org: "GitHub Community",
    desc: "活跃于开源社区，多个项目获得超过 1000+ Stars，被收录为知名库的贡献者。",
    icon: Award,
    type: "award",
  },
  {
    year: "2018 — 2021",
    title: "软件开发工程师",
    org: "创业公司",
    desc: "从 0 到 1 参与产品开发，负责前端架构设计、后端 API 开发及数据库优化。",
    icon: Briefcase,
    type: "work",
  },
  {
    year: "2014 — 2018",
    title: "计算机科学与技术 · 学士",
    org: "某大学",
    desc: "系统学习计算机科学基础，参与 ACM 竞赛获省级奖项，毕业设计获优秀论文。",
    icon: GraduationCap,
    type: "education",
  },
];

const typeColors = {
  work: "from-emerald-400 to-green-500",
  award: "from-yellow-400 to-amber-500",
  education: "from-teal-400 to-cyan-500",
};

export function Timeline() {
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
            <Briefcase className="w-4 h-4" />
            <span>个人履历</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">旅程</span>与成长
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            每一段经历都是成长的印记
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* 中轴线 */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent md:-translate-x-1/2" />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* 时间节点圆点 */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                    typeColors[item.type as keyof typeof typeColors]
                  } flex items-center justify-center ring-4 ring-background`}
                >
                  <item.icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* 内容卡片 */}
              <div
                className={`flex-1 ml-12 md:ml-0 ${
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform">
                  <div
                    className={`text-sm font-mono text-primary mb-2 ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    {item.year}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <div className="text-sm text-primary/80 font-medium mb-3">
                    {item.org}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* 空白占位 */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
