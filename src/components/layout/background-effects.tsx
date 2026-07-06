"use client";

import { ParticleField } from "./particle-field";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 粒子星场 */}
      <ParticleField />

      {/* 顶部微弱呼吸光晕 — 给整体画面增加一点深度 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
