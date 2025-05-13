// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const config = {
    temperature: 2,
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.0-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `write a three different script for 30 second to 60 second video on topic: ${process.argv[2] || 'kids story'}, 
give me response in JSON format and follow the scheama 
{
  scripts:[
    {
      content:""
    },
  ],
}`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    
    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
      console.log(chunk.text);  // Still log each chunk for debugging
    }
    
    // Try to extract JSON from the response
    const jsonMatch = fullText.match(/```json([\s\S]*?)```/) || 
                     fullText.match(/^(\{[\s\S]*\})$/);
                     
    if (jsonMatch && jsonMatch[1]) {
      // Return clean JSON
      console.log(JSON.parse(jsonMatch[1].trim()));
    } else {
      console.log("Couldn't extract JSON from the response:", fullText);
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

main();