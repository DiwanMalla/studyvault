import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubjectCard from "@/components/cards/subject-card";

export default async function HomePage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { topics: true },
      },
    },
  });

  const stats = await prisma.$transaction([
    prisma.subject.count(),
    prisma.topic.count(),
    prisma.document.count(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <span className="text-green-300">✓</span> 100% Free • No Login
              Required • For MBBS Students
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              MBBS Study Materials
              <span className="block text-blue-200">at Your Fingertips</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Access Medicine, Pediatrics, Gynae, Surgery & Minor subjects. 
              All documents are view-only, watermarked, and protected. Start learning instantly!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/subjects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Browse Subjects
                <span>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{stats[0]}</div>
                <div className="text-sm text-blue-200">Subjects</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats[1]}</div>
                <div className="text-sm text-blue-200">Topics</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats[2]}</div>
                <div className="text-sm text-blue-200">Documents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why StudyVault?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide secure, free access to study materials while protecting
              content creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🆓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Completely Free
              </h3>
              <p className="text-gray-600 text-sm">
                No hidden fees, no subscriptions. Access all materials at no
                cost.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Viewing
              </h3>
              <p className="text-gray-600 text-sm">
                View-only documents with watermarks. No downloads or printing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Access
              </h3>
              <p className="text-gray-600 text-sm">
                No login required. Start reading immediately without any
                barriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Browse Subjects
              </h2>
              <p className="text-gray-600">
                Explore our collection of study materials
              </p>
            </div>
            <Link
              href="/subjects"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All
              <span>→</span>
            </Link>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No subjects yet
              </h3>
              <p className="text-gray-600">
                Check back soon for study materials!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.slice(0, 6).map((subject) => (
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

          {subjects.length > 6 && (
            <div className="text-center mt-8">
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                View All Subjects
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Protected Content</h3>
                <p className="text-sm text-gray-400">
                  All documents are watermarked and view-only
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No Downloads
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No Printing
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Watermarked
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
