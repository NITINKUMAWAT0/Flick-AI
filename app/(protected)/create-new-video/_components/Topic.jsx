"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SparkleIcon } from "lucide-react";
import { useState } from "react";

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

export const Topic = ({ onHandleInputChange }) => {
  const [selectTopic, setSelectTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [scripts, setScripts] = useState([]);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(null);
  const [customScript, setCustomScript] = useState("");
  const [scriptTabValue, setScriptTabValue] = useState("generated");

  const handleCustomTopicChange = (e) => {
    const value = e.target.value;
    setCustomTopic(value);
    onHandleInputChange("topic", value);
  };

  const handleCustomScriptChange = (e) => {
    const value = e.target.value;
    setCustomScript(value);
    onHandleInputChange("selectedScript", { content: value, custom: true });
  };

  const handleScriptSelection = (index) => {
    setSelectedScriptIndex(index);
    setScriptTabValue("generated");
    // Pass the selected script to the parent component
    onHandleInputChange("selectedScript", scripts[index]);
  };

  const handleScriptTabChange = (value) => {
    setScriptTabValue(value);
    
    // When switching to custom script tab, deselect any generated script
    if (value === "custom") {
      setSelectedScriptIndex(null);
      // If there's already content in the custom script, pass it
      if (customScript.trim()) {
        onHandleInputChange("selectedScript", { content: customScript, custom: true });
      }
    } else if (value === "generated" && selectedScriptIndex !== null) {
      // When switching back to generated, if there's a selection, pass it
      onHandleInputChange("selectedScript", scripts[selectedScriptIndex]);
    }
  };

  const generateScript = async () => {
    const topicToUse = selectTopic || customTopic.trim();
    
    if (!topicToUse) {
      setError("Please select or enter a topic first");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setScripts([]);
    setSelectedScriptIndex(null); // Reset selected script when generating new ones
    setScriptTabValue("generated"); // Switch to generated tab when generating new scripts
    
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicToUse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await response.json();
      
      if (!data.scripts || !Array.isArray(data.scripts)) {
        throw new Error("Received invalid scripts format");
      }

      setScripts(data.scripts);
      onHandleInputChange("scripts", data.scripts);
    } catch (err) {
      console.error("Script generation error:", err);
      setError(err.message || "Failed to generate scripts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Project Title</h2>
        <Input
          placeholder="Enter project title"
          className="mt-2"
          onChange={(e) => onHandleInputChange("title", e.target.value)}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium">Video Topic</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select or enter a topic for your video
        </p>
        
        <Tabs defaultValue="suggestion" className="w-full mt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Custom Topic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestion">
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant={suggestion === selectTopic ? "default" : "secondary"}
                  onClick={() => {
                    setSelectTopic(suggestion);
                    setCustomTopic("");
                    onHandleInputChange("topic", suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="your_topic">
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Enter your custom topic"
                value={customTopic}
                onChange={handleCustomTopicChange}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Be specific for better results (e.g., "The science behind black holes")
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={generateScript}
        disabled={isLoading || (!selectTopic && !customTopic.trim())}
        className="w-full"
      >
        <SparkleIcon className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Generate Script"}
      </Button>
      
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {(scripts.length > 0 || customScript) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Script Selection</h3>
          
          <Tabs value={scriptTabValue} onValueChange={handleScriptTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generated">Generated Scripts</TabsTrigger>
              <TabsTrigger value="custom">Write Your Own</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generated">
              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Click on a script to select it for your video
                </p>
                {scripts.map((script, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedScriptIndex === index 
                        ? "bg-primary text-primary-foreground border-2 border-white" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => handleScriptSelection(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Script Option {index + 1}</h4>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                      {script.content}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Write your own script here"
                  value={customScript}
                  onChange={handleCustomScriptChange}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Create your own script for your video
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Topic;