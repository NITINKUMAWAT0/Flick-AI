import { GoogleGenerativeAI } from '@google/generative-ai';

// Create a singleton for the AI model
let aiInstance = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY ?? "AIzaSyCGtYAfHNFZ22iJnW9geMEkk-1HGO3MFJk";
    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }
    aiInstance = new GoogleGenerativeAI(apiKey);
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

// Adding a new method to match the expected interface in the function file
export const GenerateImageScript = {
  sendMessage: async (params) => {
    try {
      const ai = getAI();
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const generationConfig = {
        temperature: 0.8,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 4096,
      };
      
      const chat = model.startChat({
        generationConfig,
        history: []
      });
      
      // Make sure we can use the prompt passed from the function
      const prompt = params.prompt || "";
      
      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();
      
      return {
        response: {
          text: () => {
            // Try to extract JSON from the response
            const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              return jsonMatch[1].trim();
            }
            return responseText;
          }
        }
      };
    } catch (error) {
      console.error("Error generating image script:", error);
      throw error;
    }
  }
};

// Keep the original function for direct usage if needed
export const generateImagePrompt = async (style, script) => {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const generationConfig = {
      temperature: 0.8,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 4096,
    };
    
    const chat = model.startChat({
      generationConfig,
      history: []
    });
    
    const prompt = `Generate Image prompt of ${style} style with all details for each scene for 30 seconds video - Just Give specifying image prompt depends on the story line - do not give camera angle image prompt - Follow the Following schema and return JSON data (Max 4–5 Images)
    [
      {
        imagePrompt: '',
        sceneContent: '${script}'
      }
    ]`;
    
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return responseText;
    }
  } catch (error) {
    console.error("Error generating image script:", error);
    throw error;
  }
};

export default GenerateImageScript;