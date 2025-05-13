import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";

// Create a reusable function for script generation
export async function generateScript(topic) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
    
    const config = {
      temperature: 2,
      responseMimeType: 'text/plain',
    };
    
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `write a three different script for 30 second to 60 second video on topic:${topic}, 
give me response in JSON format and follow the scheama 
{
  scripts:[
    {
      content:""
    },
  ],
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: config,
    });

    const response = result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/^(\{[\s\S]*\})$/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }
    
    // If no JSON formatting, try to parse directly
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error in generateScript:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
    
    const scriptData = await generateScript(topic);
    
    return NextResponse.json(scriptData);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate scripts" }, { status: 500 });
  }
}