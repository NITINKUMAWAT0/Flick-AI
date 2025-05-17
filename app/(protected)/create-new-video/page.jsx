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

const CreateNewVideo = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
    
    // Clear status messages when form data changes
    setError("");
    setSuccess(false);
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const GenerateVideo = async () => {
    // Reset status
    setError("");
    setSuccess(false);
    
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
    
    try {
      setLoading(true);
      
      const result = await axios.post('/api/generate-video-data', {
        ...formData
      });
      
      console.log("API Response:", result);
      
      if (result.data.success) {
        setSuccess(true);
      } else {
        setError("Failed to process video request");
      }
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
          
          {success && (
            <div className="text-green-500 mt-2 p-2 bg-green-50 rounded-md">
              Video generation process started successfully!
            </div>
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