import Link from "next/link";

interface SubjectCardProps {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  topicCount: number;
}

const defaultColors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-teal-500 to-teal-600",
];

export default function SubjectCard({
  name,
  slug,
  description,
  icon,
  color,
  topicCount,
}: SubjectCardProps) {
  // Use name hash for consistent color per subject
  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    defaultColors.length;
  const gradientColor = color || defaultColors[colorIndex];
  const displayIcon = icon || "📖";

  return (
    <Link href={`/subjects/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Gradient Header */}
        <div
          className={`h-24 bg-linear-to-br ${gradientColor} flex items-center justify-center`}
        >
          <span className="text-5xl filter drop-shadow-lg">{displayIcon}</span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              {topicCount} {topicCount === 1 ? "topic" : "topics"}
            </span>
            <span className="text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
