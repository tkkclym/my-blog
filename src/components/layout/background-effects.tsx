"use client";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 网格背景 */}
      <div className="absolute inset-0 tech-grid-bg opacity-40" />

      {/* 顶部光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] tech-glow" />

      {/* 浮动光球 */}
      <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div
        className="absolute top-[60%] right-[10%] w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-green-500/8 rounded-full blur-[110px] animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
