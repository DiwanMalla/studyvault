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
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-xl">{icon || "📑"}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {name}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs rounded-full bg-blue-50 text-blue-600 px-3 py-1">
              {documentCount} documents
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
