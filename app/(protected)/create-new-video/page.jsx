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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CreateNewVideo = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
  const { user } = useUser();
  const router = useRouter();
  
  // Fixed query call - using clerkUserId parameter to match the query definition
  const userData = useQuery(api.users.getUserByClerkId, 
    user?.id ? { clerkUserId: user.id } : "skip"
  );

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

    if (!userData) {
      setError("Loading user data...");
      return;
    }

    // Check if user has enough credits
    if (userData.credits <= 0) {
      setError("You have 0 credits left! Please purchase more credits to continue generating videos.");
      return;
    }

    if (userData.credits < 1) {
      setError("Insufficient credits. Please purchase more credits to generate videos.");
      return;
    }
        
    try {
      setLoading(true);
            
      // Save the video data to db with current credits
      const videoRecord = await CreateInitialVideoRecord({
        title: formData.title || formData.topic, // Fallback to topic if title is not set
        topic: formData.topic,
        script: formData.selectedScript?.content,
        videoStyle: formData.style,
        caption: formData.caption,
        voice: formData.voice,
        uid: userData._id, // Use the Convex user ID, not Clerk ID
        createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
        credits: userData.credits // Pass current credits from Convex
      });
            
      console.log("Created video record:", videoRecord);
            
      // Generate the video through the API (starts background processing)
      const result = await axios.post('/api/generate-video-data', {
        ...formData,
        videoId: videoRecord,
      });
            
      console.log("API Response:", result);
      
      // Redirect to dashboard after successfully starting video generation
      router.push('/dashboard');
          
    } catch (err) {
      console.error("Failed to generate video:", err);
      setError(err.response?.data?.error || err.message || "Failed to generate video. Please try again.");
      setLoading(false); // Only set loading to false on error since we redirect on success
    }
    // Note: We don't set loading to false on success because we're redirecting
  };

  return (
    <div className="mt-6 mx-6">
      <h2 className="font-semibold text-3xl">Create New Video</h2>
      
      {/* Display current credits with warning if low */}
      {userData && (
        <div className="mt-2 text-sm">
          <span className={userData.credits <= 0 ? "text-red-600 font-semibold" : userData.credits <= 2 ? "text-yellow-600" : "text-gray-600"}>
            Credits remaining: {userData.credits}
          </span>
          {userData.credits <= 0 && (
            <div className="mt-1 text-red-600 font-medium">
              ⚠️ No credits left! Purchase more to continue.
            </div>
          )}
        </div>
      )}
            
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
            disabled={loading || !userData || userData.credits <= 0}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Starting generation... Redirecting to dashboard
              </>
            ) : userData && userData.credits <= 0 ? (
              <>
                💳 Buy More Credits
              </>
            ) : (
              <>
                <WandSparkles className="h-4 w-4 mr-2" />
                Generate ({userData ? userData.credits : 0} credits)
              </>
            )}
          </Button>
          
          {/* Show purchase link when no credits */}
          {userData && userData.credits <= 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Out of credits!</strong> You need credits to generate videos. 
                <a href="/pricing" className="text-blue-600 hover:underline ml-1">
                  Purchase more credits here →
                </a>
              </p>
            </div>
          )}
          
          {/* Loading indicator during generation */}
          {loading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                🎬 Starting video generation... You'll be redirected to your dashboard where you can monitor the progress.
              </p>
            </div>
          )}
        </div>
                
        <div>
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewVideo;