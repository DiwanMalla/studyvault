
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SubjectCardProps {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  topicCount: number;
}

const defaultColors = [
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-purple-50 text-purple-600 border-purple-100",
  "bg-emerald-50 text-emerald-600 border-emerald-100",
  "bg-orange-50 text-orange-600 border-orange-100",
  "bg-pink-50 text-pink-600 border-pink-100",
  "bg-teal-50 text-teal-600 border-teal-100",
];

export default function SubjectCard({
  name,
  slug,
  description,
  icon,
  topicCount,
}: SubjectCardProps) {
  // Use name hash for consistent color per subject
  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    defaultColors.length;
  const colorClass = defaultColors[colorIndex];
  const displayIcon = icon || "📖";

  return (
    <Link href={`/subjects/${slug}`} className="group block h-full">
      <div className="relative h-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClass}`}
          >
            {displayIcon}
          </div>
          <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
            {topicCount} {topicCount === 1 ? "Topic" : "Topics"}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-6">
            {description}
          </p>
        )}

        <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </Link>
  );
}

