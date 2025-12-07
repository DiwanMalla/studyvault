import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Upload Card */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Upload Document
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload PDF documents to topics. Setup subjects and topics first.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Upload
              </Link>
            </div>
          </div>
        </div>

        {/* Subject Management Card */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Manage Subjects
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create and edit subjects and topics with AI-powered auto-fill.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/subjects"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Manage Subjects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
