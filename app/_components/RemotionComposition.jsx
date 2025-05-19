'use client';
import React, { useEffect } from 'react';
import { useVideoConfig } from 'remotion';

function RemotionComposition({ videoData, setDurationInFrame }) {
  const { fps } = useVideoConfig();

  useEffect(() => {
    if (!videoData?.captionJson) return;

    let parsedCaption;
    try {
      parsedCaption =
        typeof videoData.captionJson === 'string'
          ? JSON.parse(videoData.captionJson)
          : videoData.captionJson;
    } catch (error) {
      console.error("Error parsing captionJson:", error);
      return;
    }

    const words = parsedCaption?.words;

    if (Array.isArray(words) && words.length > 0) {
      const maxEndInSec = Math.max(
        ...words
          .map(word => word?.end)
          .filter(end => typeof end === 'number')
      );

      const durationInFrames = Math.round(maxEndInSec * fps);
      console.log("Computed durationInFrames:", durationInFrames);
      setDurationInFrame(durationInFrames);
    } else {
      console.warn("No valid 'words' array found in captionJson:", parsedCaption);
    }
  }, [videoData, fps, setDurationInFrame]);

  return <div>Remotion Composition</div>;
}

export default RemotionComposition;
