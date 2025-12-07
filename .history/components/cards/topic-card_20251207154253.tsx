import Link from 'next/link';

interface TopicCardProps {
  name: string;
  slug: string;
  subjectSlug: string;
  description?: string | null;
  documentCount: number;
}

export default function TopicCard({
  name,
  slug,
  subjectSlug,
  description,
  documentCount,
}: TopicCardProps) {
  return (
    <Link href={`/subjects/${subjectSlug}/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-xl">📑</span>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {documentCount} {documentCount === 1 ? 'doc' : 'docs'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
            View documents
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
