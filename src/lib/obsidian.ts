/**
 * Obsidian Markdown 兼容层
 *
 * 处理 Obsidian 特有语法，转换为标准 Markdown / HTML：
 * - [[wikilinks]] -> 链接
 * - ![[image.png]] -> 图片嵌入
 * - ![[video.mp4]] -> 视频嵌入
 * - > [!note] Callout -> 带样式的提示框
 * - ==高亮文本== -> <mark>标签
 * - $$数学公式$$ -> 数学渲染
 */

/** 处理 Obsidian 双链语法 [[link]] */
function processWikilinks(content: string): string {
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
    const text = alias || target;
    const slug = target.trim().toLowerCase().replace(/\s+/g, "-");
    return `[${text}](/blog/${slug})`;
  });
}

/** 处理 Obsidian 嵌入语法 ![[file]] */
function processEmbeds(content: string): string {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (_, filename) => {
    const file = filename.trim();
    const ext = file.split(".").pop()?.toLowerCase();

    // 图片
    if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext || "")) {
      return `![${file}](/images/${file})`;
    }

    // 视频
    if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) {
      return `\n<video controls width="100%" src="/videos/${file}">不支持的视频格式</video>\n`;
    }

    // 音频
    if (["mp3", "wav", "ogg", "m4a"].includes(ext || "")) {
      return `\n<audio controls src="/audios/${file}">不支持的音频格式</audio>\n`;
    }

    // PDF
    if (ext === "pdf") {
      return `\n<embed src="/pdfs/${file}" type="application/pdf" width="100%" height="600px" />\n`;
    }

    // 其他文件作为链接
    return `[${file}](/files/${file})`;
  });
}

/** 处理 Obsidian Callout 语法 > [!type] title */
function processCallouts(content: string): string {
  const calloutRegex = /^>\s*\[!(note|tip|warning|danger|info|quote)\]\s*(.*)$/gm;

  // 先匹配 callout 块
  const lines = content.split("\n");
  const result: string[] = [];
  let inCallout = false;
  let calloutType = "";
  let calloutTitle = "";
  let calloutContent: string[] = [];

  const calloutIcons: Record<string, string> = {
    note: "📝",
    tip: "💡",
    warning: "⚠️",
    danger: "🔴",
    info: "ℹ️",
    quote: "💬",
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const calloutMatch = line.match(/^>\s*\[!(note|tip|warning|danger|info|quote)\]\s*(.*)$/);

    if (calloutMatch) {
      // 如果已有 callout 正在处理，先关闭它
      if (inCallout) {
        result.push(buildCallout(calloutType, calloutTitle, calloutContent));
        calloutContent = [];
      }
      inCallout = true;
      calloutType = calloutMatch[1];
      calloutTitle = calloutMatch[2] || calloutIcons[calloutMatch[1]] + " " + calloutMatch[1];
      continue;
    }

    if (inCallout) {
      if (line.startsWith(">") || line.trim() === "") {
        if (line.startsWith(">")) {
          calloutContent.push(line.replace(/^>\s?/, ""));
        } else {
          calloutContent.push("");
        }
        continue;
      } else {
        // callout 结束
        result.push(buildCallout(calloutType, calloutTitle, calloutContent));
        calloutContent = [];
        inCallout = false;
      }
    }

    result.push(line);
  }

  // 处理末尾的 callout
  if (inCallout) {
    result.push(buildCallout(calloutType, calloutTitle, calloutContent));
  }

  return result.join("\n");
}

function buildCallout(type: string, title: string, content: string[]): string {
  const contentStr = content.join("\n").trim();
  return `\n<div class="callout callout-${type}">\n<div class="callout-title">${title}</div>\n\n${contentStr}\n</div>\n`;
}

/** 处理 ==高亮== 语法 */
function processHighlights(content: string): string {
  return content.replace(/==(.+?)==/g, "<mark>$1</mark>");
}

/** 处理行内代码中的反引号转义问题（保留代码块） */
function processMath(content: string): string {
  // 块级公式 $$...$$
  content = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `\n<div class="math-block">$$${math}$$</div>\n`;
  });
  return content;
}

/** 主处理函数 */
export function processObsidianSyntax(content: string): string {
  let result = content;

  // 1. 先处理嵌入语法 ![[...]]
  result = processEmbeds(result);

  // 2. 处理 Callout
  result = processCallouts(result);

  // 3. 处理双链 [[...]]
  result = processWikilinks(result);

  // 4. 处理高亮 ==...==
  result = processHighlights(result);

  // 5. 处理数学公式
  result = processMath(result);

  return result;
}
