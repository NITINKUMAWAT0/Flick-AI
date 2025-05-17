import { inngest } from "./client"; 
import axios from "axios";
import { createClient } from "@deepgram/sdk";

const BASE_URL = "https://aigurulab.tech";

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data" },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    const { selectedScript, topic, title, caption, style, voice } = event?.data;
    
    // Extract script content from selectedScript
    const script = selectedScript?.content;
    
    if (!script) {
      throw new Error("Script content not found");
    }
    
    // Generate Audio File MP3
  const generateAudioFile = await step.run("GenerateAudioFile", async () => {
      const result = await axios.post(
        BASE_URL + "/api/text-to-speech",
        {
          input: script,
          voice: voice,
        },
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_GEN_AUDIO_VIDEO,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(result.data.audio);
      return result.data.audio;
    });

    // Generate Captions with improved error handling and timeout
    const GenerateCaption = await step.run("generateCaption", async () => {
      try {
        // Make sure we're using the correct environment variable
        const apiKey = process.env.DEEPGRAM_API_KEY || process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
        
        if (!apiKey) {
          throw new Error("Deepgram API key not found in environment variables");
        }
        
        console.log("Initializing Deepgram client");
        const deepgram = createClient(apiKey);
        
        console.log("Starting transcription for URL:", generateAudioFile);
        
        // Add timeout to the request to prevent hanging
        const { result, error } = await Promise.race([
          deepgram.listen.prerecorded.transcribeUrl(
            { url: generateAudioFile },
            { 
              model: "nova-3",
              smart_format: true 
            }
          ),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Deepgram transcription timed out after 30 seconds")), 30000)
          )
        ]);
        
        if (error) {
          console.error("Deepgram transcription error:", error);
          throw error;
        }
        
        console.log("Transcription completed successfully");
        return result?.channels[0]?.alternatives[0]?.words;

      } catch (err) {
        console.error("Caption generation failed:", err.message);
        // Provide a fallback response instead of failing completely
        return {
          error: err.message,
          fallback: true,
          results: {
            channels: [
              {
                alternatives: [
                  {
                    transcript: script.split("(.)").join(" "),
                  }
                ]
              }
            ]
          }
        };
      }
    });
    
    console.log("Caption generation result:", JSON.stringify(GenerateCaption, null, 2));
    
    // TODO: Generate Image Prompt from Script
    // TODO: Implement AI image generation
    // TODO: Implement database storage
    
    return { 
      audioUrl: generateAudioFile,
      captions: GenerateCaption,
      // script: script,
      // title: title,
      // topic: topic
    };
  }
);