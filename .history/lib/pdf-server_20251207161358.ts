import { put } from "@vercel/blob";

// We need to configure pdfjs-dist for Node.js environment
// Using dynamic import for ESM compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;

async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Disable worker for Node.js environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";
  }
  return pdfjsLib;
}

// Dynamic import for canvas (ESM compatible)
async function getCanvas() {
  const canvasModule = await import("canvas");
  return canvasModule;
}

// Canvas and context type for the factory
interface CanvasAndContext {
  canvas: ReturnType<typeof import("canvas").createCanvas> | null;
  context: CanvasRenderingContext2D | null;
}

// Create a canvas factory for Node.js
function createNodeCanvasFactory() {
  return {
    create: async function (width: number, height: number) {
      const { createCanvas } = await getCanvas();
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      return {
        canvas: canvas,
        context: context,
      };
    },
    reset: function (
      canvasAndContext: CanvasAndContext,
      width: number,
      height: number
    ) {
      if (canvasAndContext.canvas) {
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
      }
    },
    destroy: function (canvasAndContext: CanvasAndContext) {
      canvasAndContext.canvas = null;
      canvasAndContext.context = null;
    },
  };
}

export async function uploadPdfToBlob(
  file: File | Blob,
  filename: string
): Promise<string> {
  const blob = await put(filename, file, {
    access: "public", // We keep it in the blob store, but we don't share the URL.
    addRandomSuffix: true, // Add random suffix to avoid filename conflicts
    // Note: Vercel Blob access 'public' means the URL is theoretically reachable if known.
    // 'private' is not strictly available in the same way for these arbitrary files without token access,
    // but the URL is random. We rely on NOT sharing this URL.
  });
  return blob.url;
}

export async function getSecurePdfPage(
  blobUrl: string,
  pageNumber: number,
  sessionId: string
): Promise<Buffer> {
  // 1. Fetch the PDF buffer from Vercel Blob (server-to-server)
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  // 2. Load PDF Document
  const pdfjs = await getPdfJs();
  const canvasFactory = createNodeCanvasFactory();

  // @ts-expect-error - pdfjs types don't match exactly for Node.js canvas factory
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    canvasFactory: canvasFactory,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdfDocument = await loadingTask.promise;

  // 3. Get the page
  const page = await pdfDocument.getPage(pageNumber);

  // 4. Render to Canvas
  const scale = 2.0; // High quality
  const viewport = page.getViewport({ scale });

  const { createCanvas } = await getCanvas();
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvasFactory: canvasFactory,
  };

  await page.render(renderContext).promise;

  // 5. Apply Watermark
  const width = canvas.width;
  const height = canvas.height;

  context.save();
  context.globalAlpha = 0.3;

  // Diagonal Text
  context.translate(width / 2, height / 2);
  context.rotate(-Math.PI / 4);
  context.font = "bold 40px sans-serif";
  context.fillStyle = "red";
  context.textAlign = "center";

  const timestamp = new Date().toISOString().split("T")[0];
  const watermarkText = `StudyVault — Do Not Share — ${sessionId} — ${timestamp}`;

  // Repeat watermark a few times
  for (let i = -3; i <= 3; i++) {
    context.fillText(watermarkText, 0, i * 150);
  }

  context.restore();

  // 6. Return PNG Buffer
  return canvas.toBuffer("image/png");
}

export async function getPdfPageCount(blobUrl: string): Promise<number> {
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  const pdfjs = await getPdfJs();
  const canvasFactory = createNodeCanvasFactory();

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    canvasFactory: canvasFactory,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdfDocument = await loadingTask.promise;
  return pdfDocument.numPages;
}
