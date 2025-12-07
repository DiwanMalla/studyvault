import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single topic
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        subject: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

// PUT update topic
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, icon, color } = body;

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(color && { color }),
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// DELETE topic
// DELETE topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if topic exists first to give better error message or handle gracefully
    // Alternatively, we can just try delete and catch code P2025
    try {
      await prisma.topic.delete({
        where: { id },
      });
    } catch (e: any) {
      if (e.code === "P2025") {
        // Record to delete does not exist.
        // We can treat this as success (idempotent) or return 404.
        // Returning 404 informs the client properly.
        return NextResponse.json(
          { error: "Topic not found or already deleted" },
          { status: 404 }
        );
      }
      throw e;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
