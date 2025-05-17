'use client';

import React, { useState, useEffect } from "react";
import Topic from "./_components/Topic";
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Caption from "./_components/Caption";
import Preview from "./_components/Preview";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const CreateNewVideo = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
    setError(""); // Clear error when form data changes
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const GenerateVideo = async () => {
    // Updated validation to match the actual form data structure
    if (!formData?.topic || 
        !formData?.selectedScript?.content || 
        !formData?.style || 
        !formData?.caption || 
        !formData?.voice) {
      setError("Please enter all required fields");
      console.log("ERROR:", "Enter All Fields");
      return;
    }

    if (!user) {
      setError("User authentication required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Save the video data to db
      const videoRecord = await CreateInitialVideoRecord({
        title: formData.title || formData.topic, // Fallback to topic if title is not set
        topic: formData.topic,
        script: formData.selectedScript?.content,
        videoStyle: formData.style,
        caption: formData.caption,
        voice: formData.voice,
        uid: user.id,
        createdBy: user.primaryEmailAddress?.emailAddress || "unknown"
      });
      
      console.log("Created video record:", videoRecord);
      
      // Generate the video through the API
      const result = await axios.post('/api/generate-video-data', {
        ...formData,
        videoId: videoRecord
      });
      
      console.log("API Response:", result);
      
    } catch (err) {
      console.error("Failed to generate video:", err);
      setError(err.response?.data?.error || "Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 mx-6">
      <h2 className="font-semibold text-3xl">Create New Video</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="col-span-2 p-7 border rounded-xl">
          <Topic onHandleInputChange={onHandleInputChange} />
          <VideoStyle onHandleInputChange={onHandleInputChange} />
          <Voice onHandleInputChange={onHandleInputChange} />
          <Caption onHandleInputChange={onHandleInputChange} />
          
          {error && (
            <div className="text-red-500 mt-2 p-2 bg-red-50 rounded-md">{error}</div>
          )}
          
          <Button 
            className="mt-6" 
            onClick={GenerateVideo} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Processing...
              </>
            ) : (
              <>
                <WandSparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
        
        <div>
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewVideo;