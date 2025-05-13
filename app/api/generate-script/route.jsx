import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: "Valid topic is required" },
        { status: 400 }
      );
    }


    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "AIzaSyCGtYAfHNFZ22iJnW9geMEkk-1HGO3MFJk")
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate three different YouTube short scripts (30-60 seconds) about: ${topic}.
Respond with ONLY JSON following this exact schema:
{
  "scripts": [
    {
      "content": "Full script text here with engaging hook, main content, and call-to-action"
    },
    {
      "content": "Alternative approach to the topic"
    },
    {
      "content": "Creative take on the subject"
    }
  ]
}

Important:
- Each script should be 50-100 words
- Include natural pauses marked with (.)
- No code blocks or markdown in response
- Only return the JSON object`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean and parse the response
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7).trim();
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3).trim();
    }

    const jsonResponse = JSON.parse(cleanText);
    
    if (!jsonResponse.scripts || !Array.isArray(jsonResponse.scripts)) {
      throw new Error("Invalid response structure from API");
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate scripts",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}