"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/**
 * 移动端顶部阅读进度条（PC 端已改为左侧 TOC 目录导航，此组件仅移动端）
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const article = document.querySelector("article");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      const articleBottom = articleTop + articleHeight;
      if (scrollTop + viewportHeight >= articleBottom) {
        setProgress(100);
        return;
      }

      if (scrollTop + viewportHeight <= articleTop) {
        setProgress(0);
        return;
      }

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
    const timer = setTimeout(handleScroll, 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] lg:hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-border/20" />
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
