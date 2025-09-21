"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory('');
    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.story) {
        setStory(data.story);
      } else {
        setStory('Failed to generate story. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
      setStory('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Enter a Prompt:</label>
        <Textarea
          placeholder="e.g., A magical craft made from stardust"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <Button
        className="w-full bg-primary hover:bg-primary/90"
        onClick={generateStory}
        disabled={loading || !prompt}
      >
        {loading ? (
          <>
            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
            Generating Story...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Story
          </>
        )}
      </Button>
      {story && (
        <div>
          <label className="text-sm font-medium mb-2 block">Generated Story:</label>
          <div className="whitespace-pre-line p-4 border rounded-md">{story}</div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
