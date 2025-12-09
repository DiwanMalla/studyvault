"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    subjects: any[];
    topics: any[];
    documents: any[];
  }>({
    subjects: [],
    topics: [],
    documents: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ subjects: [], topics: [], documents: [] });
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setResults({
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
          topics: Array.isArray(data.topics) ? data.topics : [],
          documents: Array.isArray(data.documents) ? data.documents : [],
        });
      } catch (err) {
        setResults({ subjects: [], topics: [], documents: [] });
      } finally {
        setShowDropdown(true);
        setLoading(false);
      }
    }, 200);
    // eslint-disable-next-line
    return () =>
      debounceTimeout.current && clearTimeout(debounceTimeout.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  }

  function handleSelect(item: any, type: "subject" | "topic" | "document") {
    setShowDropdown(false);
    setQuery("");
    if (type === "subject") {
      router.push(`/subjects/${item.slug}`);
    } else if (type === "topic") {
      router.push(`/subjects/${item.subject.slug}/${item.slug}`);
    } else {
      router.push(`/document/${item.id}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const total =
      results.subjects.length +
      results.topics.length +
      results.documents.length;
    if (!showDropdown || total === 0) return;
    if (e.key === "ArrowDown") {
      setHighlight((h) => (h + 1) % total);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => (h - 1 + total) % total);
      e.preventDefault();
    } else if (e.key === "Enter" && highlight >= 0) {
      const all = [
        ...results.subjects,
        ...results.topics,
        ...results.documents,
      ];
      const item = all[highlight];
      let type: "subject" | "topic" | "document" = "subject";
      if (highlight < results.subjects.length) type = "subject";
      else if (highlight < results.subjects.length + results.topics.length)
        type = "topic";
      else type = "document";
      handleSelect(item, type);
      e.preventDefault();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-48 md:w-64"
      autoComplete="off"
    >
      <input
        ref={inputRef}
        type="text"
        className="block w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
        placeholder="Search subjects or topics..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(-1);
        }}
        aria-label="Search subjects or topics"
        onFocus={() => query && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
        tabIndex={-1}
        aria-label="Search"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>
      {showDropdown &&
        ((results?.subjects &&
          Array.isArray(results.subjects) &&
          results.subjects.length > 0) ||
          (results?.topics &&
            Array.isArray(results.topics) &&
            results.topics.length > 0) ||
          (results?.documents &&
            Array.isArray(results.documents) &&
            results.documents.length > 0) ||
          loading) && (
          <div
            ref={dropdownRef}
            className="absolute left-0 z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-700 max-h-80 overflow-auto"
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            )}
            {results.subjects.length > 0 && (
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Subjects
              </div>
            )}
            {results.subjects.map((subject, i) => (
              <button
                key={subject.id}
                type="button"
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-50 dark:focus:bg-blue-900/30 transition-colors ${
                  highlight === i ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
                onClick={() => handleSelect(subject, "subject")}
                onMouseEnter={() => setHighlight(i)}
              >
                <span className="text-lg">{subject.icon || "📚"}</span>
                <span>{subject.name}</span>
              </button>
            ))}
            {results.topics.length > 0 && (
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Topics
              </div>
            )}
            {results.topics.map((topic, i) => (
              <button
                key={topic.id}
                type="button"
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-50 dark:focus:bg-blue-900/30 transition-colors ${
                  highlight === i + results.subjects.length
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : ""
                }`}
                onClick={() => handleSelect(topic, "topic")}
                onMouseEnter={() => setHighlight(i + results.subjects.length)}
              >
                <span className="text-lg">{topic.icon || "📑"}</span>
                <span>{topic.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {topic.subject?.name}
                </span>
              </button>
            ))}
            {results.documents.length > 0 && (
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Documents
              </div>
            )}
            {results.documents.map((doc, i) => (
              <button
                key={doc.id}
                type="button"
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-50 dark:focus:bg-blue-900/30 transition-colors ${
                  highlight ===
                  i + results.subjects.length + results.topics.length
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : ""
                }`}
                onClick={() => handleSelect(doc, "document")}
                onMouseEnter={() =>
                  setHighlight(
                    i + results.subjects.length + results.topics.length
                  )
                }
              >
                <span className="text-lg">{doc.icon || "📄"}</span>
                <span>{doc.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {doc.topic?.name} / {doc.topic?.subject?.name}
                </span>
              </button>
            ))}
            {!loading &&
              results.subjects.length === 0 &&
              results.topics.length === 0 &&
              results.documents.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No results found.
                </div>
              )}
          </div>
        )}
    </form>
  );
}
