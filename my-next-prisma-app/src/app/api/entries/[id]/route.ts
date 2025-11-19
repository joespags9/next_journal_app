import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = await prisma.journals.findUnique({
    where: { id: Number(id) },
  });

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, author, caption, image, text } = await req.json();

  try {
    const entry = await prisma.journals.update({
      where: { id: Number(id) },
      data: { title, author, caption, image, text },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.journals.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}
