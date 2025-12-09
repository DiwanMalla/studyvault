import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import TopicCard from "@/components/cards/topic-card";
import EmptyState from "@/components/ui/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await prisma.subject.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!subject) return { title: "Subject Not Found" };

  return {
    title: `${subject.name} - StudyVault`,
    description:
      subject.description || `Browse ${subject.name} topics on StudyVault`,
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      topics: {
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { documents: true },
          },
        },
      },
    },
  });

  if (!subject) {
    notFound();
  }

  const totalDocuments = subject.topics.reduce(
    (acc: number, topic: { _count: { documents: number } }) =>
      acc + topic._count.documents,
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
              { label: subject.name },
            ]}
          />

          <div className="mt-6 flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-3xl">{subject.icon || "📖"}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {subject.name}
              </h1>
              {subject.description && (
                <p className="mt-2 text-gray-600 max-w-2xl">
                  {subject.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span>{subject.topics.length} topics</span>
                <span>•</span>
                <span>{totalDocuments} documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Topics</h2>

        {subject.topics.length === 0 ? (
          <EmptyState
            icon="📑"
            title="No topics yet"
            description="This subject doesn't have any topics yet. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.topics.map(
              (topic: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                icon: string | null;
                color: string | null;
                subjectId: string;
                createdAt: Date;
                updatedAt: Date;
                _count: { documents: number };
              }) => (
                <TopicCard
                  key={topic.id}
                  name={topic.name}
                  slug={topic.slug}
                  subjectSlug={slug}
                  description={topic.description}
                  documentCount={topic._count.documents}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
