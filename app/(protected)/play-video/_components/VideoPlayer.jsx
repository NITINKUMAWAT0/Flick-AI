'use client';
import React, { useState } from "react";
import { Player } from "@remotion/player";
import RemotionComposition from "@/app/_components/RemotionComposition";

const VideoPlayer = ({ videoData }) => {
  const [frameDuration, setFrameDuration] = useState(100);

  const safeDuration = Number.isFinite(frameDuration)
    ? Math.round(frameDuration + 100)
    : 200;

  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={safeDuration}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{
          width: '25vw',
          height: '70vh',
        }}
        inputProps={{
          videoData: videoData,
          setDurationInFrame: (frameValue) => setFrameDuration(frameValue),
        }}
      />
    </div>
  );
};

export default VideoPlayer;
