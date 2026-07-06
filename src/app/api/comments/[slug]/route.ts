import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comments = await getComments(slug);
  return NextResponse.json({ slug, comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "昵称不能为空" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "评论内容不能为空" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "评论内容不能超过2000字" },
        { status: 400 }
      );
    }

    const comment = await addComment(slug, name, content);
    return NextResponse.json({ slug, comment });
  } catch {
    return NextResponse.json(
      { error: "评论提交失败" },
      { status: 500 }
    );
  }
}
