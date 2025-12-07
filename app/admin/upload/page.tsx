import { prisma } from "@/lib/prisma";
import AdminUploadForm from "@/components/admin/AdminUploadForm";

export default async function AdminUploadPage() {
  // Fetch subjects and their topics
  const subjects = await prisma.subject.findMany({
    include: {
      topics: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Upload Document
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a new PDF to the library. Ensure you select the correct subject and topic.
          </p>
        </div>
      </div>

      <AdminUploadForm subjects={subjects} />
    </div>
  );
}
