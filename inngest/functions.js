// Function file with inngest
import { inngest } from "./client";
import axios from "axios";
import { createClient } from "@deepgram/sdk";
import GenerateImageScript from "@/configs/AIModel";

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
    const { selectedScript, topic, title, caption, style, voice } = event?.data;

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
        // Make sure we're using the correct environment variable
        const apiKey =
          process.env.DEEPGRAM_API_KEY ||
          process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

        if (!apiKey) {
          throw new Error(
            "Deepgram API key not found in environment variables"
          );
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
              smart_format: true,
            }
          ),
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error("Deepgram transcription timed out after 30 seconds")
                ),
              30000
            )
          ),
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
                  },
                ],
              },
            ],
          },
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

    //4. Generate Images Using AI...
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

    //Implement database storage

    return GenerateImages;
  }
);