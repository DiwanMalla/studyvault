"use client";

import { useState, useRef, useEffect } from "react";

interface PDFViewerProps {
  documentId: string;
  totalPages: number;
  title: string;
}

function PDFPage({
  documentId,
  pageNumber,
  title,
}: {
  documentId: string;
  pageNumber: number;
  title: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cache-busting URL
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible to keep it loaded
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "200% 0px", // Load when within 2 viewport heights (aggressive preload)
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Set URL when visible (or close to visible)
      setUrl(`/api/pdf/${documentId}/${pageNumber}?t=${Date.now()}`);
    }
  }, [isVisible, documentId, pageNumber]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-white rounded-lg shadow-2xl overflow-hidden mb-8 min-h-[800px] w-full max-w-4xl mx-auto"
    >
      {/* Transparent overlay for security */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ cursor: "default" }}
      />
      
      {/* Show spinner only if we are visible and still loading */}
      {isVisible && loading && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
             <div className="flex flex-col items-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                 <p className="mt-4 text-gray-600">Loading page {pageNumber}...</p>
             </div>
         </div>
      )}

      {error ? (
        <div className="flex items-center justify-center h-[800px] text-red-600 bg-red-50">
          <div className="text-center">
            <p className="text-lg font-medium">Failed to load page {pageNumber}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setUrl(`/api/pdf/${documentId}/${pageNumber}?t=${Date.now()}`);
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors z-20 relative"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        url && (
            <img
            src={url}
            alt={`Page ${pageNumber} of ${title}`}
            className="w-full h-auto select-none block"
            // Removed native lazy loading to rely on our aggressive observer
            // loading="lazy" 
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
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
        )
      )}
    </div>
  );
}

export default function PDFViewer({
  documentId,
  totalPages,
  title,
}: PDFViewerProps) {
  // Create array of page numbers [1, 2, 3, ... totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

   // Prevent right-click
   const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div
        className="flex-1 w-full p-4 md:p-8"
        onContextMenu={handleContextMenu}
      >
        <div className="space-y-8">
            {pages.map((pageNumber) => (
                <PDFPage 
                    key={pageNumber} 
                    documentId={documentId} 
                    pageNumber={pageNumber} 
                    title={title} 
                />
            ))}
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
      `}</style>
    </div>
  );
}
