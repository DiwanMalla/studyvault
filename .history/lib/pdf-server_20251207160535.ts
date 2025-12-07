import { put } from "@vercel/blob";
import * as fs from 'fs';
import * as path from 'path';

// We need to configure pdfjs-dist for Node.js environment
// Using dynamic import for ESM compatibility
let pdfjsLib: any;

async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  }
  return pdfjsLib;
}

// Create a canvas factory for Node.js
// Create a canvas factory for Node.js
function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function (width: number, height: number) {
    const { createCanvas } = require("canvas");
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context,
    };
  },
  reset: function (canvasAndContext: any, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },
  destroy: function (canvasAndContext: any) {
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

export async function uploadPdfToBlob(file: File | Blob, filename: string): Promise<string> {
  const blob = await put(filename, file, {
    access: "public", // We keep it in the blob store, but we don't share the URL.
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
  // We use Uint8Array for loading
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    // @ts-ignore
    canvasFactory: new NodeCanvasFactory(),
  });
  
  const pdfDocument = await loadingTask.promise;
  
  // 3. Get the page
  const page = await pdfDocument.getPage(pageNumber);
  
  // 4. Render to Canvas
  const scale = 2.0; // High quality
  const viewport = page.getViewport({ scale });
  
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    // @ts-ignore
    canvasFactory: new NodeCanvasFactory(),
  };
  
  // @ts-ignore
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
  
  const timestamp = new Date().toISOString().split('T')[0];
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
    
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      // @ts-ignore
      canvasFactory: new NodeCanvasFactory(),
    });
    
    const pdfDocument = await loadingTask.promise;
    return pdfDocument.numPages;
}
