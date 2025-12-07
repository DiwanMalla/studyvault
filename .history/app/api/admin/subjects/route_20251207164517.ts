import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: { topics: true },
        },
        topics: {
          include: {
            _count: {
              select: { documents: true },
            },
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, icon } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    // Check if slug already exists
    const existing = await prisma.subject.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Subject with this name already exists" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
