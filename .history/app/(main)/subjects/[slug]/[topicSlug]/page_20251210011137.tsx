import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import DocumentCard from "@/components/cards/document-card";
import EmptyState from "@/components/ui/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;

  const topic = await prisma.topic.findFirst({
    where: {
      slug: topicSlug,
      subject: { slug },
    },
    include: { subject: true },
  });

  if (!topic) return { title: "Topic Not Found" };

  return {
    title: `${topic.name} - ${topic.subject.name} - StudyVault`,
    description:
      topic.description || `Browse ${topic.name} documents on StudyVault`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;

  const topic = await prisma.topic.findFirst({
    where: {
      slug: topicSlug,
      subject: {
        slug: slug,
      },
    },
    include: {
      subject: true,
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  const totalPages = topic.documents.reduce(
    (
      acc: number,
      doc: {
        id: string;
        title: string;
        description: string | null;
        blobUrl: string;
        pageCount: number;
        fileSize: number | null;
        topicId: string;
        views: number;
        createdAt: Date;
        updatedAt: Date;
      }
    ) => acc + doc.pageCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: "Subjects", href: "/subjects" },
              { label: topic.subject.name, href: `/subjects/${slug}` },
              { label: topic.name },
            ]}
          />

          <div className="mt-8 flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">{topic.icon || "📑"}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {topic.name}
              </h1>
              {topic.description && (
                <p className="text-base text-gray-600 leading-relaxed max-w-3xl mb-4">
                  {topic.description}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {topic.documents.length}
                  </span>
                  {topic.documents.length === 1 ? "document" : "documents"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                  {totalPages === 1 ? "page" : "pages"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Documents</h2>

        {topic.documents.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No documents yet"
            description="This topic doesn't have any documents yet. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topic.documents.map(
              (document: {
                id: string;
                title: string;
                description: string | null;
                blobUrl: string;
                pageCount: number;
                fileSize: number | null;
                topicId: string;
                views: number;
                createdAt: Date;
                updatedAt: Date;
              }) => (
                <DocumentCard
                  key={document.id}
                  id={document.id}
                  title={document.title}
                  description={document.description}
                  pageCount={document.pageCount}
                  views={document.views}
                  createdAt={document.createdAt}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
