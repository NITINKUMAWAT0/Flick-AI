"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const suggestions = [
  "Historic Story",
  "Kids Story",
  "Movie Stories",
  "AI Innovations",
  "Space Mysteries",
  "Horror Stories",
  "Mythological Tales",
  "Tech Breakthroughs",
  "True Crime Stories",
  "Fantasy Adventures",
  "Science Experiments",
  "Motivational Stories",
];

const Topic = ({ onHandleInputChange }) => {
  const [selectTopic, setSelectTopic] = useState(null);

  const handleCustomTopicChange = (e) => {
    const value = e.target.value;
    onHandleInputChange('topic', value);
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Project Title</h2>
      <Input 
        placeholder="Enter project title" 
        className="mt-4" 
        onChange={(e) => onHandleInputChange('title', e.target.value)}
      />
      <div className="mt-6">
        <h2 className="text-lg font-medium">Video Topic</h2>
        <p className="text-sm text-gray-600 mb-3">
          Select a topic for your project
        </p>
        <Tabs defaultValue="suggestion" className="w-full mt-2">
          <TabsList className="bg-black border-none">
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestion">
            <div className="mt-4">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  className={`mx-1.5 mt-2 bg-black text-white ${
                    suggestion === selectTopic ? "bg-white text-black" : ""
                  }`}
                  onClick={() => {
                    setSelectTopic(suggestion);
                    onHandleInputChange('topic', suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="your_topic">
            <div className="mt-4">
              <h2>Enter your own topic</h2>
              <Textarea 
                placeholder="Enter your topic" 
                onChange={handleCustomTopicChange} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Topic;