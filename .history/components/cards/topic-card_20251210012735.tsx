import Link from "next/link";

interface TopicCardProps {
  name: string;
  slug: string;
  subjectSlug: string;
  description?: string | null;
  documentCount: number;
  icon?: string | null;
}

export default function TopicCard({
  name,
  slug,
  subjectSlug,
  description,
  documentCount,
  icon,
}: TopicCardProps) {
  return (
    <Link href={`/subjects/${subjectSlug}/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300">
        <div className="p-6">
          {/* Icon and name */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{icon || "📑"}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {/* Document count */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {documentCount} {documentCount === 1 ? "document" : "documents"}
            </span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
