import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const entries = await prisma.journals.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const { title, author, caption, image, text } = await req.json();
  const entry = await prisma.journals.create({
    data: { title, author, caption, image, text }
  });
  return NextResponse.json(entry, { status: 201 });
}
