export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 从 Markdown 内容中提取所有标题作为目录项
 */
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 1 = h1, 2 = h2, 3 = h3
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");

    items.push({ id, text, level });
  }

  return items;
}
