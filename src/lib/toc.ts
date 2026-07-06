export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 从 Markdown 内容中提取标题作为目录项。
 * 会先剔除围栏代码块（``` 和 ~~~），避免把代码内的 # 注释误识别为标题。
 */
export function extractToc(content: string): TocItem[] {
  // 先去掉所有围栏代码块（``` 和 ~~~），多行模式匹配
  const cleaned = content
    .replace(/^```[\s\S]*?^```/gm, "")
    .replace(/^~~~[\s\S]*?^~~~/gm, "");

  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(cleaned)) !== null) {
    const level = match[1].length; // 1 = h1, 2 = h2, 3 = h3
    const text = match[2]
      .replace(/[`*_~\[\]]/g, "") // 去掉标题内的行内格式标记
      .trim();

    if (!text) continue;

    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");

    items.push({ id, text, level });
  }

  return items;
}
