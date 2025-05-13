// configs/AIModel.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Create a singleton for the AI model
let aiInstance = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY ?? "AIzaSyCGtYAfHNFZ22iJnW9geMEkk-1HGO3MFJk";
    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }
    aiInstance = new GoogleGenerativeAI({ apiKey });
  }
  return aiInstance;
}

export const generateScript = {
  sendMessage: async (prompt) => {
    try {
      const ai = getAI();
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      return {
        response: {
          text: () => {
            const responseText = result.response.text();
            // Try to clean up the response if it contains markdown code blocks
            const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              return jsonMatch[1].trim();
            }
            return responseText;
          }
        }
      };
    } catch (error) {
      console.error("Error in AI model:", error);
      throw error;
    }
  }
};