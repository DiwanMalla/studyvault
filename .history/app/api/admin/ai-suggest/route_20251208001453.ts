import { NextRequest, NextResponse } from "next/server";
import { generateSubjectDetails, generateTopicDetails } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, subjectName } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (type === "subject") {
      const suggestion = await generateSubjectDetails(name);
      return NextResponse.json(suggestion);
    } else if (type === "topic") {
      if (!subjectName) {
        return NextResponse.json(
          { error: "Subject name is required for topic suggestions" },
          { status: 400 }
        );
      }
      const suggestion = await generateTopicDetails(name, subjectName);
      return NextResponse.json(suggestion);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'subject' or 'topic'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("AI suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
