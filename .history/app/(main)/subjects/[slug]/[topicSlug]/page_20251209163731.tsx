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
    (acc: number, doc: any) => acc + doc.pageCount,
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

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
            {topic.description && (
              <p className="mt-2 text-gray-600 max-w-2xl">
                {topic.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span>{topic.documents.length} documents</span>
              <span>•</span>
              <span>{totalPages} pages total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents</h2>

        {topic.documents.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No documents yet"
            description="This topic doesn't have any documents yet. Check back soon!"
          />
        ) : (
          <div className="space-y-4">
            {topic.documents.map((document) => (
              <DocumentCard
                key={document.id}
                id={document.id}
                title={document.title}
                description={document.description}
                pageCount={document.pageCount}
                views={document.views}
                createdAt={document.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
