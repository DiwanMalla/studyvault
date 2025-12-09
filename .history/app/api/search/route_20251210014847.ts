
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ subjects: [], topics: [], documents: [] });

  // Search subjects
  const subjects = await prisma.subject.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, slug: true, icon: true },
    take: 5,
  });

  // Search topics
  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      subject: { select: { slug: true, name: true } },
    },
    take: 5,
  });

  // Search documents
  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      topic: {
        select: {
          slug: true,
          name: true,
          subject: { select: { slug: true, name: true } },
        },
      },
    },
    take: 5,
  });

  return NextResponse.json({ subjects, topics, documents });
}
