import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface SubjectSuggestion {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface TopicSuggestion {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export async function generateSubjectDetails(
  subjectName: string
): Promise<SubjectSuggestion> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for an MBBS medical education platform called StudyVault. 
Generate details for medical subjects. Always respond with valid JSON only, no markdown or extra text.
Icons should be emoji characters suitable for the subject.
Colors should be Tailwind CSS color classes like "blue-500", "red-500", "green-500", etc.
Slugs should be URL-friendly lowercase with hyphens.
Descriptions should be 1-2 sentences about the subject for MBBS students.`,
      },
      {
        role: "user",
        content: `Generate details for the MBBS subject: "${subjectName}"
        
Return JSON in this exact format:
{
  "name": "Subject Name",
  "slug": "subject-name",
  "description": "Brief description for MBBS students",
  "icon": "🩺",
  "color": "blue-500"
}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch {
    // Return defaults if parsing fails
    return {
      name: subjectName,
      slug: subjectName.toLowerCase().replace(/\s+/g, "-"),
      description: `Study materials for ${subjectName}`,
      icon: "📚",
      color: "blue-500",
    };
  }
}

export async function generateTopicDetails(
  topicName: string,
  subjectName: string
): Promise<TopicSuggestion> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for an MBBS medical education platform called StudyVault.
Generate details for medical topics within subjects. Always respond with valid JSON only, no markdown or extra text.
Icons should be emoji characters suitable for the topic.
Colors should be Tailwind CSS color classes like "blue-500", "red-500", "green-500", etc.
Slugs should be URL-friendly lowercase with hyphens.
Descriptions should be 1-2 sentences about the topic for MBBS students.`,
      },
      {
        role: "user",
        content: `Generate details for the topic "${topicName}" under the subject "${subjectName}" for MBBS students.
        
Return JSON in this exact format:
{
  "name": "Topic Name",
  "slug": "topic-name",
  "description": "Brief description for MBBS students",
  "icon": "❤️",
  "color": "red-500"
}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch {
    return {
      name: topicName,
      slug: topicName.toLowerCase().replace(/\s+/g, "-"),
      description: `Study materials for ${topicName}`,
      icon: "📖",
      color: "gray-500",
    };
  }
}

export async function suggestTopicsForSubject(
  subjectName: string,
  count: number = 5
): Promise<string[]> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for an MBBS medical education platform.
Suggest important topics that MBBS students should study for a given subject.
Always respond with a JSON array of topic names only, no extra text.`,
      },
      {
        role: "user",
        content: `Suggest ${count} important topics for MBBS students studying "${subjectName}".
        
Return JSON array like: ["Topic 1", "Topic 2", "Topic 3"]`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content || "[]";
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export interface DocumentSuggestion {
  title: string;
  description: string;
}

export async function generateDocumentDetails(
  filename: string,
  topicName: string
): Promise<DocumentSuggestion> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for an MBBS medical education platform called StudyVault.
Generate a clean title and description for a document based on its filename and topic.
Always respond with valid JSON only, no markdown or extra text.`,
      },
      {
        role: "user",
        content: `Generate a title and description for a file named "${filename}" uploaded to the topic "${topicName}".
        
Return JSON in this exact format:
{
  "title": "Clean Title",
  "description": "Brief description of the document's contents"
}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch {
    // Basic fallback logic
    const cleanTitle = filename
      .replace(/\.pdf$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
      
    return {
      title: cleanTitle,
      description: `Study material for ${topicName}`,
    };
  }
}
