"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define simpler types that match what we pass from Prisma
type Topic = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  topics: Topic[];
};

export default function AdminUploadForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Get topics for selected subject
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const topics = selectedSubject ? selectedSubject.topics : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopicId || !title || !file) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setIsUploading(true);
    setStatus({ type: null, message: "" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("topicId", selectedTopicId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus({
        type: "success",
        message: "Document uploaded successfully!",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      // Optional: don't reset subject/topic so they can upload multiple files to same topic easily?
      // For now, let's keep the user on the same topic context.

      // Reset file input value manually
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      router.refresh(); // Refresh server data
    } catch (error: any) {
      console.error(error);
      setStatus({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Status Message */}
      {status.message && (
        <div
          className={`p-4 rounded-md ${
            status.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Select */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTopicId(""); // Reset topic when subject changes
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-xs"
            required
          >
            <option value="">Select a subject...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Select */}
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Topic <span className="text-red-500">*</span>
          </label>
          <select
            id="topic"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            disabled={!selectedSubjectId}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">Select a topic...</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          {selectedSubjectId && topics.length === 0 && (
            <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
              This subject has no topics. Please create a topic first.
            </p>
          )}
        </div>
      </div>

      {/* Document Details */}

      <div className="flex justify-between items-end gap-4">
        <div className="flex-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Document Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-xs focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2 px-3"
              placeholder="e.g. Introduction to Calculus"
              required
            />
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            if (!file) {
              setStatus({
                type: "error",
                message: "Please select a file first.",
              });
              return;
            }
            if (!selectedSubject) {
              setStatus({
                type: "error",
                message: "Please select a subject first.",
              });
              return;
            }
            // Use topic name if selected, otherwise fallback to subject name (but API requires topic context mostly)
            const topicName =
              topics.find((t) => t.id === selectedTopicId)?.name ||
              selectedSubject.name;

            try {
              // Set loading state if we want (not reusing isUploading to avoid disabling submit)
              const res = await fetch("/api/admin/ai-suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "document",
                  name: file.name,
                  subjectName: topicName, // passing topic name as subjectName param field for simplicity or update API to accept topicName
                }),
              });

              if (!res.ok) throw new Error("Failed to generate details");

              const data = await res.json();
              setTitle(data.title);
              setDescription(data.description);
            } catch (e) {
              console.error(e);
              setStatus({ type: "error", message: "AI generation failed." });
            }
          }}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ✨ AI Fill
        </button>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-xs focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2 px-3"
            placeholder="Optional description of the document..."
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          PDF Document <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-blue-500 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF up to 10MB
            </p>
            {file && (
              <p className="text-sm font-semibold text-blue-600 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-5 flex justify-end">
        <button
          type="submit"
          disabled={isUploading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isUploading ? "opacity-75 cursor-wait" : ""
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </form>
  );
}
