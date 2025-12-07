import { put } from "@vercel/blob";
import { createCanvas } from "canvas";
import path from "path";

// pdfjs-dist v3 legacy build for Node.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// Set worker path for Node.js environment
const workerPath = path.join(
  process.cwd(),
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.js"
);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

// Cache for loaded PDF documents to avoid re-fetching
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfDocumentCache = new Map<string, { doc: any; lastAccess: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean up old cache entries periodically
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of pdfDocumentCache.entries()) {
    if (now - value.lastAccess > CACHE_TTL) {
      pdfDocumentCache.delete(key);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupCache, 60 * 1000);

// Canvas factory for Node.js
class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(
    canvasAndContext: {
      canvas: ReturnType<typeof createCanvas>;
      context: ReturnType<ReturnType<typeof createCanvas>["getContext"]>;
    },
    width: number,
    height: number
  ) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: {
    canvas: ReturnType<typeof createCanvas> | null;
    context: ReturnType<ReturnType<typeof createCanvas>["getContext"]> | null;
  }) {
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCachedPdfDocument(blobUrl: string): Promise<any> {
  // Check cache first
  const cached = pdfDocumentCache.get(blobUrl);
  if (cached) {
    cached.lastAccess = Date.now();
    return cached.doc;
  }

  // Fetch and load the PDF
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  const canvasFactory = new NodeCanvasFactory();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    canvasFactory: canvasFactory,
    standardFontDataUrl: "node_modules/pdfjs-dist/standard_fonts/",
  });

  const pdfDocument = await loadingTask.promise;

  // Cache the document
  pdfDocumentCache.set(blobUrl, {
    doc: pdfDocument,
    lastAccess: Date.now(),
  });

  return pdfDocument;
}

export async function uploadPdfToBlob(
  file: File | Blob,
  filename: string
): Promise<string> {
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function getSecurePdfPage(
  blobUrl: string,
  pageNumber: number
): Promise<Buffer> {
  // Get cached or load PDF document
  const pdfDocument = await getCachedPdfDocument(blobUrl);

  // Get the page
  const page = await pdfDocument.getPage(pageNumber);

  // Render to Canvas - keeping high quality (scale 2.0)
  const scale = 2.0;
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");

  const canvasFactory = new NodeCanvasFactory();
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvasFactory: canvasFactory,
  };

  await page.render(renderContext).promise;

  // Apply Watermark
  const width = canvas.width;
  const height = canvas.height;

  context.save();
  context.globalAlpha = 0.18;

  // Diagonal Text
  context.translate(width / 2, height / 2);
  context.rotate(-Math.PI / 4);
  context.font = "bold 48px sans-serif";
  context.fillStyle = "rgba(200, 60, 60, 0.8)";
  context.textAlign = "center";

  const timestamp = new Date().toISOString().split("T")[0];
  const watermarkText = `StudyVault — Do Not Share — ${timestamp} — MBBS`;

  // Repeat watermark for coverage
  for (let i = -6; i <= 6; i++) {
    context.fillText(watermarkText, 0, i * 120);
  }

  context.restore();

  // Return PNG Buffer
  return canvas.toBuffer("image/png");
}

export async function getPdfPageCount(blobUrl: string): Promise<number> {
  const pdfDocument = await getCachedPdfDocument(blobUrl);
  return pdfDocument.numPages;
}
