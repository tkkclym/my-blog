"use client";

import { useEffect, useState, useCallback } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;

    // 文章开始进入视口后才显示进度
    if (scrollTop < articleTop - 100) {
      setVisible(false);
      setProgress(0);
      return;
    }

    setVisible(true);

    // 计算阅读进度：文章已滚动的高度 / 文章总可滚动高度
    const scrolledPastArticle = scrollTop - articleTop;
    const maxScroll = articleHeight - viewportHeight;

    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }

    const pct = Math.min(Math.max((scrolledPastArticle / maxScroll) * 100, 0), 100);
    setProgress(Math.round(pct));
  }, []);

  useEffect(() => {
    // 初始计算
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  // 如果文章还没进入视口，不渲染（避免闪烁）
  if (!visible) return null;

  return (
    <>
      {/* ===== 移动端：顶部进度条 ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px] md:hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-border/20" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(52,211,153,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== PC 端：左侧竖向进度条 ===== */}
      <div
        className="hidden md:block fixed z-40 select-none"
        style={{
          left: "max(calc((100vw - 792px) / 2 - 56px), 8px)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        aria-hidden="true"
      >
        {/* 轨道 */}
        <div className="relative w-[3px] h-40 rounded-full bg-border/30 overflow-hidden">
          {/* 填充 */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-400 via-emerald-500 to-teal-400 rounded-full transition-all duration-200 ease-out shadow-[0_0_14px_rgba(52,211,153,0.6)]"
            style={{ height: `${progress}%` }}
          />
        </div>

        {/* 百分比数字 */}
        <div className="mt-3 text-center">
          <span className="text-[11px] font-mono font-medium text-emerald-400/80 tabular-nums">
            {progress}
          </span>
        </div>
      </div>
    </>
  );
}
