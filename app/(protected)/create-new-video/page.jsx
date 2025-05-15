'use client';

import React, { useState, useEffect } from "react";
import Topic from "./_components/Topic";
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Caption from "./_components/Caption";
import Preview from "./_components/Preview";
import { Button } from "@/components/ui/button"; // Changed import
import { WandSparkles } from "lucide-react";

const CreateNewVideo = () => {
  const [formData, setFormData] = useState({});

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  return (
    <div className="mt-6 mx-6">
      <h2 className="font-semibold text-3xl">Create New Video</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="col-span-2 p-7 border rounded-xl">
          <Topic onHandleInputChange={onHandleInputChange} />
          <VideoStyle onHandleInputChange={onHandleInputChange} />
          <Voice onHandleInputChange={onHandleInputChange}/>
          <Caption onHandleInputChange={onHandleInputChange} />
          
          <Button className="mt-6">
            <WandSparkles className="h-4 w-4" />
            Generate
          </Button>
        </div>

        <div>
          <Preview/>
        </div>
      </div>
    </div>
  );
};

export default CreateNewVideo;