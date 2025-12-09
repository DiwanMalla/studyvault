"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-48 md:w-64">
      <input
        type="text"
        className="block w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
        placeholder="Search subjects or topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search subjects or topics"
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
    </form>
  );
}
