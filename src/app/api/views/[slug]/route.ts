import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

// 静态导出模式：预生成所有文章的浏览数据
export const dynamic = "force-static";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.json({ slug, count: 0 });
}
