// Complete updated function file with inngest
import { inngest } from "./client";
import axios from "axios";
import { createClient } from "@deepgram/sdk";
import GenerateImageScript from "@/configs/AIModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const ImagePromptScript = `Generate Image prompt of {style} style with all details for each scene for 30 seconds video - Just Give specifying image prompt depends on the story line - do not give camera angle image prompt - Follow the Following schema and return JSON data (Max 4-5 Images) 
[
  {
    imagePrompt: '',
    sceneContent: '{script}'
  }
]`;

const BASE_URL = "https://aigurulab.tech";

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data" },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    const { selectedScript, topic, title, caption, style, voice, videoId } = event?.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    // Extract script content from selectedScript
    const script = selectedScript?.content;

    if (!script) {
      throw new Error("Script content not found");
    }

    //1. Generate Audio File MP3....
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

    //2. Generate Captions.....
 const GenerateCaption = await step.run("generateCaption", async () => {
  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    // Make the Deepgram API request with words enabled
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: generateAudioFile },
      {
        model: "nova-3",
        smart_format: true,
        words: true, // This ensures word-level timings are returned
        punctuate: true,
        paragraphs: true
      }
    );

    if (error) {
      console.error("Deepgram API error:", error);
      throw error;
    }

    // Safely extract words with proper null checks
    const words = result?.results?.channels[0]?.alternatives[0]?.words;
    const transcript = result?.results?.channels[0]?.alternatives[0]?.transcript;

    if (!words || !transcript) {
      console.warn("Deepgram response missing words or transcript");
      return {
        error: "Missing words or transcript in response",
        fallback: true,
        transcript: script.split("(.)").join(" "),
        words: [] // Return empty array for consistent structure
      };
    }

    return {
      transcript,
      words,
      timingConfidence: words.reduce((acc, word) => acc + word.confidence, 0) / words.length
    };

  } catch (err) {
    console.error("Caption generation failed:", err);
    return {
      error: err.message,
      fallback: true,
      transcript: script.split("(.)").join(" "),
      words: [] // Return empty array for consistent structure
    };
  }
});

    //3. Generate Image Prompt from Script....
    const GenerateImagePrompts = await step.run(
      "generateImagePrompt",
      async () => {
        // Create the final prompt by replacing placeholders
        const FINAL_PROMPT = ImagePromptScript.replace(
          "{style}",
          style
        ).replace("{script}", script);

        // Send the prompt to the GenerateImageScript service
        const result = await GenerateImageScript.sendMessage({
          prompt: FINAL_PROMPT,
        });

        // Parse the response
        try {
          const responseText = result.response.text();
          return JSON.parse(responseText);
        } catch (error) {
          console.error("Error parsing image prompt response:", error);
          throw error;
        }
      }
    );

    //4. Generate Images Using AI....
    const GenerateImages = await step.run("generateImages", async () => {
      let images = [];
      images = await Promise.all(
        GenerateImagePrompts.map(async (element) => {
          const result = await axios.post(
            BASE_URL + "/api/generate-image",
            {
              width: 1024,
              height: 1024,
              input: element?.imagePrompt,
              model: "sdxl",
              aspectRatio: "1:1", 
            },
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_GEN_AUDIO_VIDEO, 
                "Content-Type": "application/json", 
              },
            }
          );
          console.log(result.data.image);
          return result.data.image;
        })
      );
      return images;
    });

    //5. Implement database storage....
    const UpdateDB = await step.run(
      'Update', async () => {
        const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
          videoRecord: videoId,
          audioUrl: generateAudioFile, // Use the actual audio URL we generated
          captionJson: JSON.stringify(GenerateCaption), // Convert to string as expected by the mutation
          images: JSON.stringify(GenerateImages), // Convert array to string as expected by the mutation
        });
        return result;
      }
    );

    return 'Executed successfully!';
  }
);