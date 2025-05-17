import { inngest } from "./client";
import axios from "axios";

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

    // Generate Captions
    // TODO: Implement caption generation

    // Generate Image Prompt from Script
    // TODO: Implement image prompt generation

    // Generate Images using AI
    // TODO: Implement AI image generation

    // Save all data to DB
    // TODO: Implement database storage

    return generateAudioFile;
  }
);