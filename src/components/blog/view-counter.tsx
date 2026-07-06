"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
  initialCount?: number;
}

export function ViewCounter({ slug, initialCount = 0 }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // 增加浏览次数
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.count !== undefined) {
          setCount(data.count);
        }
      })
      .catch(() => {
        // 静默失败，不影响用户体验
      });
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="w-4 h-4" />
      <span>{count.toLocaleString()}</span>
      <span className="hidden sm:inline">次浏览</span>
    </span>
  );
}
