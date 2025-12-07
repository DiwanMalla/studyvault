"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count: {
    documents: number;
  };
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count: {
    topics: number;
  };
  topics: Topic[];
}

interface FormData {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    icon: "📚",
    color: "blue-500",
  });
  const [topicFormData, setTopicFormData] = useState<FormData>({
    name: "",
    description: "",
    icon: "📖",
    color: "gray-500",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const colorOptions = [
    "blue-500",
    "red-500",
    "green-500",
    "yellow-500",
    "purple-500",
    "pink-500",
    "indigo-500",
    "teal-500",
    "orange-500",
    "cyan-500",
  ];

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleAiSuggest = async (type: "subject" | "topic") => {
    const name = type === "subject" ? formData.name : topicFormData.name;
    if (!name.trim()) {
      setError("Please enter a name first");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          subjectName: type === "topic" ? selectedSubject?.name : undefined,
        }),
      });

      if (res.ok) {
        const suggestion = await res.json();
        if (type === "subject") {
          setFormData({
            name: suggestion.name || formData.name,
            description: suggestion.description || "",
            icon: suggestion.icon || "📚",
            color: suggestion.color || "blue-500",
          });
        } else {
          setTopicFormData({
            name: suggestion.name || topicFormData.name,
            description: suggestion.description || "",
            icon: suggestion.icon || "📖",
            color: suggestion.color || "gray-500",
          });
        }
      } else {
        setError("Failed to get AI suggestion");
      }
    } catch (err) {
      console.error("AI suggestion error:", err);
      setError("Failed to get AI suggestion");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingSubject
        ? `/api/admin/subjects/${editingSubject.id}`
        : "/api/admin/subjects";
      const method = editingSubject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingSubject(null);
        setFormData({
          name: "",
          description: "",
          icon: "📚",
          color: "blue-500",
        });
        fetchSubjects();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save subject");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save subject");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...topicFormData,
          subjectId: selectedSubject.id,
        }),
      });

      if (res.ok) {
        setShowTopicModal(false);
        setTopicFormData({
          name: "",
          description: "",
          icon: "📖",
          color: "gray-500",
        });
        fetchSubjects();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save topic");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save topic");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this subject? All topics and documents will be deleted."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/subjects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSubjects();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this topic? All documents will be deleted."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/topics/${topicId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSubjects();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      icon: subject.icon || "📚",
      color: subject.color || "blue-500",
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "", icon: "📚", color: "blue-500" });
    setShowModal(true);
  };

  const openAddTopicModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setTopicFormData({
      name: "",
      description: "",
      icon: "📖",
      color: "gray-500",
    });
    setShowTopicModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
          <p className="text-gray-600 mt-1">
            Create and manage MBBS subjects and topics
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back
          </Link>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span> Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6">
        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              No subjects yet. Create your first subject!
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Subject
            </button>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Subject Header */}
              <div
                className={`bg-${
                  subject.color || "blue-500"
                } bg-opacity-10 p-4 border-b border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{subject.icon || "📚"}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {subject.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {subject._count.topics} topics
                    </span>
                    <button
                      onClick={() => openAddTopicModal(subject)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Add Topic"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => openEditModal(subject)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Subject"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Subject"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* Topics List */}
              <div className="p-4">
                {subject.topics.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No topics yet.{" "}
                    <button
                      onClick={() => openAddTopicModal(subject)}
                      className="text-blue-600 hover:underline"
                    >
                      Add one
                    </button>
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{topic.icon || "📖"}</span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {topic.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {topic._count.documents} documents
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete Topic"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </h2>
            </div>

            <form onSubmit={handleSubmitSubject} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Medicine, Surgery"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAiSuggest("subject")}
                    disabled={aiLoading || !formData.name.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <span>🤖</span>
                    )}
                    AI Fill
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description for MBBS students"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl text-center"
                    placeholder="📚"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSubject ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && selectedSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Add Topic to {selectedSubject.name}
              </h2>
            </div>

            <form onSubmit={handleSubmitTopic} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={topicFormData.name}
                    onChange={(e) =>
                      setTopicFormData({
                        ...topicFormData,
                        name: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Cardiology, Neurology"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAiSuggest("topic")}
                    disabled={aiLoading || !topicFormData.name.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <span>🤖</span>
                    )}
                    AI Fill
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={topicFormData.description}
                  onChange={(e) =>
                    setTopicFormData({
                      ...topicFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the topic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={topicFormData.icon}
                    onChange={(e) =>
                      setTopicFormData({
                        ...topicFormData,
                        icon: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl text-center"
                    placeholder="📖"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={topicFormData.color}
                    onChange={(e) =>
                      setTopicFormData({
                        ...topicFormData,
                        color: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
