"use client";

import { useState, useEffect, useCallback } from "react";

interface PDFViewerProps {
  documentId: string;
  totalPages: number;
  title: string;
}

export default function PDFViewer({
  documentId,
  totalPages,
  title,
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const loadPage = useCallback(() => {
    setLoading(true);
    setError(null);
    // Add cache-busting query param
    setImageUrl(`/api/pdf/${documentId}/${currentPage}?t=${Date.now()}`);
  }, [documentId, currentPage]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
              <input
                type="number"
                value={currentPage}
                onChange={handlePageInput}
                min={1}
                max={totalPages}
                className="w-12 bg-transparent text-white text-center focus:outline-none"
              />
              <span className="text-gray-400">/</span>
              <span className="text-gray-300">{totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              aria-label="Next page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Document Title */}
          <div className="hidden md:block text-sm text-gray-400 truncate max-w-xs">
            {title}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded">
              💧 Watermarked
            </span>
          </div>
        </div>
      </div>

      {/* PDF Page Display */}
      <div
        className="flex-1 overflow-auto bg-gray-900 p-4"
        onContextMenu={handleContextMenu}
      >
        <div className="max-w-4xl mx-auto">
          {/* Transparent overlay to prevent interactions */}
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
            <div
              className="absolute inset-0 z-10"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              style={{ cursor: "default" }}
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-5">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                  <p className="mt-4 text-gray-600">
                    Loading page {currentPage}...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-96 text-red-600 bg-red-50">
                <div className="text-center">
                  <p className="text-lg font-medium">Failed to load page</p>
                  <button
                    onClick={loadPage}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt={`Page ${currentPage} of ${title}`}
                className="w-full h-auto select-none"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError("Failed to load page");
                }}
                draggable={false}
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>⚠️ View-only document</span>
            <span>•</span>
            <span>Downloading and printing disabled</span>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Disable text selection */
        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Disable print */
        @media print {
          body {
            display: none !important;
          }
        }

        /* Hide number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
