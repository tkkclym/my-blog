import { NextRequest, NextResponse } from "next/server";
import { getViews, incrementViews } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const count = await getViews(slug);
  return NextResponse.json({ slug, count });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const count = await incrementViews(slug);
  return NextResponse.json({ slug, count });
}
