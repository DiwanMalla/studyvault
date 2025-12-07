import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { getSecurePdfPage } from "@/lib/pdf-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string; page: string }> }
) {
  try {
    const { docId, page } = await params;
    const pageNumber = parseInt(page, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    // Get or create session ID for watermarking
    const sessionId = await getOrCreateSessionId();

    // Fetch document metadata from DB
    const document = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Validate page number
    if (pageNumber > document.pageCount) {
      return NextResponse.json(
        { error: "Page number exceeds document length" },
        { status: 400 }
      );
    }

    // Render the page with watermark
    const imageBuffer = await getSecurePdfPage(
      document.blobUrl,
      pageNumber,
      sessionId
    );

    // Return as PNG image - convert Buffer to Uint8Array for NextResponse
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("PDF page render error:", error);
    return NextResponse.json(
      { error: "Failed to render page" },
      { status: 500 }
    );
  }
}
