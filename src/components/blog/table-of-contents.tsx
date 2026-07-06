"use client";

import { useEffect, useState, useRef } from "react";
import type { TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    // 断开旧的 observer
    if (observerRef.current) observerRef.current.disconnect();

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 找到第一个进入视口的标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // 提前 20% 触发，更敏感
        rootMargin: "-10% 0px -70% 0px",
      }
    );

    headingElements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <nav aria-label="文章目录">
      <div className="text-[10px] font-medium text-muted-foreground/50 mb-4 tracking-[0.2em] uppercase font-mono">
        目录
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded-md transition-all border-l-2 ${
                activeId === item.id
                  ? "text-primary border-primary bg-primary/5 font-medium"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
              }`}
              style={{ paddingLeft: `${8 + (item.level - 1) * 12}px` }}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
