"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    // 用 rAF 防止滚动事件过于频繁
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const article = document.querySelector("article");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // 文章底部已经滚出视口上方，说明看完了
      const articleBottom = articleTop + articleHeight;
      if (scrollTop + viewportHeight >= articleBottom) {
        setProgress(100);
        return;
      }

      // 文章还没进入视口
      if (scrollTop + viewportHeight <= articleTop) {
        setProgress(0);
        return;
      }

      // 计算进度（使用视口底部作为阅读位置的参考点）
      const readableHeight = articleHeight - viewportHeight;
      if (readableHeight <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = scrollTop - articleTop;
      const pct = Math.min(Math.max((scrolled / readableHeight) * 100, 0), 100);
      setProgress(Math.round(pct));
    });
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <>
      {/* ===== 移动端：顶部进度条 ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] md:hidden" aria-hidden="true">
        {/* 轨道背景 */}
        <div className="absolute inset-0 bg-border/20" />
        {/* 填充 */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-[width] duration-200 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== PC 端：左侧竖向进度条 + 发光圆点 ===== */}
      <div
        className="hidden md:flex fixed z-40 select-none flex-col items-center"
        style={{
          left: "max(calc((100vw - 768px) / 2 - 64px), 24px)",
          top: "20vh",
          bottom: "20vh",
        }}
        aria-hidden="true"
      >
        {/* 标签 */}
        <span className="text-[10px] font-medium text-muted-foreground/60 mb-2 tracking-widest uppercase">
          进度
        </span>

        {/* 轨道 + 填充 */}
        <div className="relative flex-1 w-[4px] rounded-full bg-border/25 overflow-visible">
          {/* 填充部分 */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-400 via-emerald-500 to-teal-400 rounded-full transition-[height] duration-200 ease-out"
            style={{ height: `${progress}%` }}
          />

          {/* 发光圆点（跟随进度移动） */}
          {progress > 0 && (
            <div
              className="absolute -left-[6px] w-4 h-4 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_16px_rgba(52,211,153,0.7),0_0_32px_rgba(52,211,153,0.3)] transition-[bottom] duration-200 ease-out border-2 border-background"
              style={{
                bottom: `${progress}%`,
                transform: progress === 100
                  ? "translateY(50%)"
                  : "translateY(8px)",
              }}
            />
          )}
        </div>

        {/* 百分比数字 */}
        <div className="mt-3 text-center">
          <span className="text-xs font-mono font-semibold text-emerald-400 tabular-nums bg-emerald-400/10 px-1.5 py-0.5 rounded-md">
            {progress}%
          </span>
        </div>
      </div>
    </>
  );
}
