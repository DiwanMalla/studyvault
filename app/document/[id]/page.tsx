import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PDFViewer from "@/components/pdf-viewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!document) return { title: "Document Not Found" };

  return {
    title: `${document.title} - StudyVault`,
    description: document.description || `View ${document.title} on StudyVault`,
  };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      topic: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (!document) {
    notFound();
  }

  // Increment view count
  await prisma.document.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Document Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/subjects/${document.topic.subject.slug}/${document.topic.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {document.title}
                </h1>
                <p className="text-sm text-gray-400">
                  {document.topic.subject.name} → {document.topic.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                📄 {document.pageCount} pages
              </span>
              <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm">
                🔒 View-only
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <PDFViewer
        documentId={document.id}
        totalPages={document.pageCount}
        title={document.title}
      />
    </div>
  );
}
