import { prisma } from "@/lib/prisma";
import SubjectCard from "@/components/cards/subject-card";
import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata = {
  title: "All Subjects - StudyVault",
  description: "Browse all available study subjects and topics",
};

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { topics: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: "Subjects" }]} />

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">All Subjects</h1>
            <p className="mt-2 text-gray-600">
              Browse our complete collection of {subjects.length} study subjects
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {subjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No subjects available
            </h3>
            <p className="text-gray-600">
              Check back soon for new study materials!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject: {
              id: string;
              name: string;
              slug: string;
              description: string | null;
              icon: string | null;
              color: string | null;
              createdAt: Date;
              updatedAt: Date;
              _count: { topics: number };
            }) => (
              <SubjectCard
                key={subject.id}
                name={subject.name}
                slug={subject.slug}
                description={subject.description}
                icon={subject.icon}
                color={subject.color}
                topicCount={subject._count.topics}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
