'use client';
import React, { useState } from "react";
import { Player } from "@remotion/player";
import RemotionComposition from "@/app/_components/RemotionComposition";

const VideoPlayer = ({ videoData }) => {
  const [durationInFrames, setDurationInFrame] = useState(100);
  
  // Ensure durationInFrames is always a valid integer
  const validDuration = Number.isInteger(durationInFrames) && durationInFrames > 0
    ? durationInFrames
    : 100;
  
  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={validDuration}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{
          width: '25vw',
          height: '70vh'
        }}
        inputProps={{
          videoData: videoData,
          setDurationInFrame: setDurationInFrame
        }}
        allowFullscreen
        loop
      />
    </div>
  );
};

export default VideoPlayer