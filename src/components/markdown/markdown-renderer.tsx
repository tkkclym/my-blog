"use client";

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
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
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
