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
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300">
        <div className="p-6">
          {/* PDF Icon */}
          <div className="w-14 h-16 rounded-lg bg-red-100 flex items-center justify-center border border-red-200 mb-4 mx-auto">
            <span className="text-3xl">📄</span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-center">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 text-center">
                {description}
              </p>
            )}

            {/* Stats */}
            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Pages</span>
                <span className="font-semibold text-gray-900">{pageCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Views</span>
                <span className="font-semibold text-gray-900">{views}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Added</span>
                <span className="font-semibold text-gray-900">
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
