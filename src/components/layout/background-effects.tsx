"use client";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 网格背景 */}
      <div className="absolute inset-0 tech-grid-bg opacity-50" />

      {/* 顶部聚光 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] tech-glow" />

      {/* 浮动磷光球体 */}
      <div className="absolute top-[15%] left-[8%] w-80 h-80 bg-primary/12 rounded-full blur-[110px] animate-float" />
      <div
        className="absolute top-[55%] right-[5%] w-[420px] h-[420px] bg-primary/6 rounded-full blur-[130px] animate-float"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="absolute bottom-[5%] left-[25%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "4.5s" }}
      />
      <div
        className="absolute top-[30%] right-[30%] w-48 h-48 bg-teal-400/8 rounded-full blur-[80px] animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* 噪点纹理 */}
      <div className="noise-overlay" />

      {/* CRT 扫描线 */}
      <div className="crt-lines" />
    </div>
  );
}
