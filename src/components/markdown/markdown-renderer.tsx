"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const heading = (level: number) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function Heading(props: any) {
      const text = React.Children.toArray(props.children)
        .map((child) => (typeof child === "string" ? child : ""))
        .join("");
      const id = slugify(text);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tag = `h${level}` as any;
      return <Tag id={id} {...props}>{props.children}</Tag>;
    };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          // 标题带 id（供 TOC 导航使用）
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          // 自定义链接渲染
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // 自定义图片渲染
          img: ({ node, ...props }) => (
            <img
              {...props}
              loading="lazy"
              className="rounded-lg border border-border max-w-full h-auto my-4"
              alt={props.alt || ""}
            />
          ),
          // 自定义视频渲染
          video: ({ node, ...props }) => (
            <video
              {...props}
              controls
              className="rounded-lg border border-border max-w-full h-auto my-4"
            />
          ),
          // 代码块渲染
          pre: ({ children }) => (
            <pre className="relative group">
              {children}
            </pre>
          ),
          // 表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
