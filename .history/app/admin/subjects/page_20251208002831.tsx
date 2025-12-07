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
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--background)' }}>
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Subjects & Topics
            </h1>
            <p className="mt-2 text-lg" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              Organize your MBBS curriculum
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'var(--background)', color: 'var(--foreground)', border: '2px solid #e5e7eb' }}
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Add Subject Button */}
      <div className="mb-8">
        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center gap-2"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          <span className="text-xl">+</span> New Subject
        </button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-20" style={{ background: 'var(--background)', border: '2px dashed #e5e7eb', borderRadius: '12px' }}>
          <div className="text-5xl mb-4">📚</div>
          <p className="text-xl font-medium mb-2" style={{ color: 'var(--foreground)' }}>No subjects yet</p>
          <p className="mb-6" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Start by creating your first subject</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            Create First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
              style={{
                background: 'var(--background)',
                borderColor: '#e5e7eb',
              }}
            >
              {/* Subject Card Header */}
              <div
                className="p-6 border-b flex items-start justify-between"
                style={{
                  background: `linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%)`,
                  borderColor: '#e5e7eb'
                }}
              >
                <div className="flex gap-4 flex-1">
                  <div className="text-5xl shrink-0">{subject.icon || "📚"}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                      {subject.name}
                    </h2>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      {subject.description || "No description"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(subject)}
                    className="p-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb' }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Topics Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    📖 {subject._count.topics} Topic{subject._count.topics !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => openAddTopicModal(subject)}
                    className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#059669' }}
                    title="Add Topic"
                  >
                    + Add
                  </button>
                </div>

                {subject.topics.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                    No topics yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 rounded-lg transition-all hover:shadow-sm"
                        style={{
                          background: 'var(--background)',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0">{topic.icon || "📖"}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                              {topic.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                              {topic._count.documents} doc{topic._count.documents !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-1.5 rounded transition-all hover:opacity-80 shrink-0"
                          style={{ color: '#dc2626', background: 'rgba(239,68,68,0.1)' }}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ background: 'var(--background)' }}>
            <div className="p-8 border-b" style={{ borderColor: '#e5e7eb' }}>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h2>
            </div>

            <form onSubmit={handleSubmitSubject} className="p-8 space-y-6">
              {error && (
                <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Subject Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="flex-1 px-4 py-2 rounded-lg border transition-all"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
                    placeholder="e.g., Medicine, Surgery"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAiSuggest("subject")}
                    disabled={aiLoading || !formData.name.trim()}
                    className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    style={{
                      background: 'rgba(139,92,246,0.2)',
                      color: '#8b5cf6'
                    }}
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
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border transition-all"
                  style={{
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    borderColor: '#e5e7eb'
                  }}
                  rows={3}
                  placeholder="Brief description for MBBS students"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border transition-all text-2xl text-center"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
                    placeholder="📚"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border transition-all"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
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
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: 'var(--foreground)',
                    color: 'var(--background)'
                  }}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ background: 'var(--background)' }}>
            <div className="p-8 border-b" style={{ borderColor: '#e5e7eb' }}>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Add Topic to <span style={{ color: '#2563eb' }}>{selectedSubject.name}</span>
              </h2>
            </div>

            <form onSubmit={handleSubmitTopic} className="p-8 space-y-6">
              {error && (
                <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
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
                    className="flex-1 px-4 py-2 rounded-lg border transition-all"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
                    placeholder="e.g., Cardiology, Neurology"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAiSuggest("topic")}
                    disabled={aiLoading || !topicFormData.name.trim()}
                    className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    style={{
                      background: 'rgba(139,92,246,0.2)',
                      color: '#8b5cf6'
                    }}
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
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
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
                  className="w-full px-4 py-2 rounded-lg border transition-all"
                  style={{
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    borderColor: '#e5e7eb'
                  }}
                  rows={3}
                  placeholder="Brief description of the topic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Icon
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
                    className="w-full px-4 py-2 rounded-lg border transition-all text-2xl text-center"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
                    placeholder="📖"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
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
                    className="w-full px-4 py-2 rounded-lg border transition-all"
                    style={{
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      borderColor: '#e5e7eb'
                    }}
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
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: 'var(--foreground)',
                    color: 'var(--background)'
                  }}
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
