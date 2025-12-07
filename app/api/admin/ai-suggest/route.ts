import { NextRequest, NextResponse } from "next/server";
import { generateSubjectDetails, generateTopicDetails, generateDocumentDetails } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, subjectName } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
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
    } else if (type === "document") {
      if (!subjectName) {
         // Reusing subjectName field for Topic Name input context (or we can add topicName param)
         // The caller should pass the topic name as 'subjectName' or we add a new field.
         // Let's check the body more carefully.
         return NextResponse.json(
          { error: "Topic name is required for document suggestions" },
          { status: 400 }
        );
      }
      const suggestion = await generateDocumentDetails(name, subjectName);
      return NextResponse.json(suggestion);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'subject', 'topic', or 'document'" },
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
