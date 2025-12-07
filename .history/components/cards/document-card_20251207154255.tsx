import Link from 'next/link';

interface DocumentCardProps {
  id: string;
  title: string;
  description?: string | null;
  pageCount: number;
  views: number;
  createdAt: Date;
}

export default function DocumentCard({
  id,
  title,
  description,
  pageCount,
  views,
  createdAt,
}: DocumentCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/document/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* PDF Icon */}
            <div className="flex-shrink-0 w-12 h-14 rounded-lg bg-red-100 flex items-center justify-center border border-red-200">
              <span className="text-2xl">📄</span>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                {title}
              </h3>
              
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  📄 {pageCount} pages
                </span>
                <span className="flex items-center gap-1">
                  👁️ {views} views
                </span>
                <span className="flex items-center gap-1">
                  📅 {formatDate(createdAt)}
                </span>
              </div>
            </div>
            
            {/* View Button */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg group-hover:bg-blue-700 transition-colors">
                View
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Security Badge */}
        <div className="border-t border-gray-100 px-5 py-2 bg-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-green-500">🔒</span> View-only
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-500">💧</span> Watermarked
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
