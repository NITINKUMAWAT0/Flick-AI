import React from "react";
import { Player } from "@remotion/player";
import RemotionComposition from "@/app/_components/RemotionComposition";

const VideoPlayer = ({videoData}) => {
    
  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={120}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{
            width:'25vw', 
            height:'70vh'
        }}
        inputProps={{
            videoData:videoData
        }}
      />
    </div>
  );
};

export default VideoPlayer;
