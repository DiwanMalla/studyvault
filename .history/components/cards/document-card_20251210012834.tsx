import Link from "next/link";

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
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Link href={`/document/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600">
        <div className="p-6">
          {/* PDF Icon */}
          <div className="w-14 h-16 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800 mb-4 mx-auto">
            <span className="text-3xl">📄</span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-center">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 text-center">
                {description}
              </p>
            )}

            {/* Stats */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span>Pages</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pageCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Views</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {views}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Added</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
