import { NextRequest, NextResponse } from "next/server";
import { uploadPdfToBlob, getPdfPageCount } from "@/lib/pdf-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const topicId = formData.get("topicId") as string;
    const description = (formData.get("description") as string) || "";

    if (!file || !title || !topicId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Upload to Blob
    const blobUrl = await uploadPdfToBlob(file, file.name);

    // 2. Get Page Count
    let pageCount = 1; // Default to 1 if detection fails
    try {
      pageCount = await getPdfPageCount(blobUrl);
      if (pageCount < 1) pageCount = 1;
    } catch (e) {
      console.error("Failed to calculate page count", e);
      // Fallback to 1 page
    }

    // 3. Save to DB
    const doc = await prisma.document.create({
      data: {
        title,
        description,
        blobUrl, // Secure URL, effectively private if not shared
        pageCount,
        topicId,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
