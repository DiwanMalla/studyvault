import { put } from "@vercel/blob";
import path from "path";

// Import canvas module at the top level for Node.js polyfills
import * as canvasModule from "canvas";

// Set up global polyfills for pdfjs BEFORE importing it
// This is required for PDF.js to render images embedded in PDFs
// @ts-expect-error - Adding polyfills to global
global.Image = canvasModule.Image;
// @ts-expect-error - Adding polyfills to global
global.ImageData = canvasModule.ImageData;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;

async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Handle both namespace import and default export
    if (pdfjsLib.default?.GlobalWorkerOptions) {
      pdfjsLib = pdfjsLib.default;
    }

    // Set worker source for Node.js environment
    const workerPath = path.join(
      process.cwd(),
      "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
    );

    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
    }
  }
  return pdfjsLib;
}

// Canvas and context type for the factory
interface CanvasAndContext {
  canvas: canvasModule.Canvas | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
}

// Create a synchronous canvas factory for Node.js
// pdfjs expects synchronous create() in some code paths
class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = canvasModule.createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext: CanvasAndContext, width: number, height: number) {
    if (canvasAndContext.canvas) {
      canvasAndContext.canvas.width = width;
      canvasAndContext.canvas.height = height;
    }
  }

  destroy(canvasAndContext: CanvasAndContext) {
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
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
  pageNumber: number,
  sessionId: string
): Promise<Buffer> {
  // 1. Fetch the PDF buffer from Vercel Blob (server-to-server)
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  // 2. Load PDF Document
  const pdfjs = await getPdfJs();
  const canvasFactory = new NodeCanvasFactory();

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

  const canvas = canvasModule.createCanvas(viewport.width, viewport.height);
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
  const canvasFactory = new NodeCanvasFactory();

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
