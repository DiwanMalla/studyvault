import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubjectCard from "@/components/cards/subject-card";
import { ArrowRight, CheckCircle2, Shield, Zap, BookOpen } from "lucide-react";

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
      <section className="relative overflow-hidden bg-background">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-linear-to-b from-blue-50/80 to-transparent opacity-50 blur-3xl rounded-full" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-indigo-50/50 to-transparent opacity-50 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-linear-to-tr from-emerald-50/50 to-transparent opacity-30 blur-2xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-xs mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Premium MBBS Study Materials • 100% Free
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
              Master Medicine with
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 pb-2">
                Confidence & Clarity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Access high-quality study materials for Medicine, Surgery,
              Pediatrics, and more. Secure, distraction-free, and designed for
              medical students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/subjects"
                className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-blue-600 px-8 font-medium text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105"
              >
                <span>Browse Library</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                How it works
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-3 gap-8 md:gap-16">
              {[
                { label: "Subjects", value: stats[0] },
                { label: "Topics", value: stats[1] },
                { label: "Documents", value: stats[2] },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Features Section */}
      <section className="py-24 bg-muted relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Students Trust StudyVault
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built to protect intellectual property while ensuring unlimited
              access to knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Completely Free
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No paywalls, subscription fees, or hidden costs. Education
                should be accessible to everyone.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure & Protected
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced watermarking and view-only access ensures content
                integrity and creator protection.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No registration required. Jump straight into your study
                materials without any friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-24 bg-background/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Subjects
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl">
                Browse our comprehensive collection of medical study materials,
                organized by subject for easy access.
              </p>
            </div>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All Subjects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Library Empty
              </h3>
              <p className="text-gray-500">
                No subjects have been added yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects
                .slice(0, 6)
                .map(
                  (subject: {
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
                      topicCount={subject._count.topics}
                    />
                  )
                )}
            </div>
          )}

          {subjects.length > 6 && (
            <div className="text-center mt-12">
              <Link
                href="/subjects"
                className="inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Load More Subjects
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative text-center">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Join thousands of medical students accessing free, high-quality
                study resources. No account needed, just pure knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/subjects"
                  className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all hover:scale-105"
                >
                  Start Browsing Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
