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
  // 1. Fetch the PDF buffer from Vercel Blob (server-to-server)
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  // 2. Load PDF Document
  const canvasFactory = new NodeCanvasFactory();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    canvasFactory: canvasFactory,
    standardFontDataUrl: "node_modules/pdfjs-dist/standard_fonts/",
  });

  const pdfDocument = await loadingTask.promise;

  // 3. Get the page
  const page = await pdfDocument.getPage(pageNumber);

  // 4. Render to Canvas
  const scale = 2.0; // High quality
  const viewport = page.getViewport({ scale });

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
  context.globalAlpha = 0.12; // Slightly more visible watermark

  // Diagonal Text
  context.translate(width / 2, height / 2);
  context.rotate(-Math.PI / 4);
  context.font = "bold 42px sans-serif";
  context.fillStyle = "rgba(180, 50, 50, 0.7)"; // Muted red, more visible
  context.textAlign = "center";

  const timestamp = new Date().toISOString().split("T")[0];
  const watermarkText = `StudyVault — Do Not Share — ${timestamp} — MBBS`;

  // Repeat watermark a few times
  for (let i = -4; i <= 4; i++) {
    context.fillText(watermarkText, 0, i * 140);
  }

  context.restore();

  // 6. Return PNG Buffer
  return canvas.toBuffer("image/png");
}

export async function getPdfPageCount(blobUrl: string): Promise<number> {
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  const canvasFactory = new NodeCanvasFactory();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    canvasFactory: canvasFactory,
  });

  const pdfDocument = await loadingTask.promise;
  return pdfDocument.numPages;
}
