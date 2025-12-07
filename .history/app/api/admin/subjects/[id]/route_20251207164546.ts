import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single subject
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            _count: {
              select: { documents: true },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject" },
      { status: 500 }
    );
  }
}

// PUT update subject
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, icon, color } = body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(color && { color }),
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 }
    );
  }
}

// DELETE subject
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete all documents in topics first
    await prisma.document.deleteMany({
      where: {
        topic: {
          subjectId: id,
        },
      },
    });

    // Delete all topics
    await prisma.topic.deleteMany({
      where: { subjectId: id },
    });

    // Delete the subject
    await prisma.subject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}
