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
    const topics = await prisma.topic.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, subjectId } = body;

    if (!name || !subjectId) {
      return NextResponse.json(
        { error: "Name and subjectId are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Check if slug already exists
    const existing = await prisma.topic.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Topic with this name already exists" },
        { status: 400 }
      );
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
        description: description || null,
        subjectId,
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
