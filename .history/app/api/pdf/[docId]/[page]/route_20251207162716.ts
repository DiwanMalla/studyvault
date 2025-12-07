import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Validate page number (skip if pageCount is 0 - means detection failed)
    if (document.pageCount > 0 && pageNumber > document.pageCount) {
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to render page", details: errorMessage },
      { status: 500 }
    );
  }
}
