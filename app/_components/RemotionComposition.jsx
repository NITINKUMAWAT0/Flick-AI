import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

function RemotionComposition({ videoData, setDurationInFrame }) {
  const { fps } = useVideoConfig();
  const [imageList, setImageList] = useState([]);
  const [duration, setDuration] = useState(100); // local duration state
  const frame = useCurrentFrame();

  // Debug audio URL to verify it's being passed correctly
  // useEffect(() => {
  //   console.log("Audio URL:", videoData?.audioUrl);
  // }, [videoData]);

  useEffect(() => {
    if (videoData?.images) {
      try {
        const parsedImages = JSON.parse(videoData.images);
        if (Array.isArray(parsedImages)) {
          setImageList(parsedImages);
        } else {
          setImageList([]);
        }
      } catch {
        setImageList([]);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (videoData?.captionJson) {
      try {
        const parsed = JSON.parse(videoData.captionJson);
        const captions = parsed.words || [];
        if (captions.length > 0) {
          const totalDuration = Math.ceil(
            captions[captions.length - 1].end * fps
          );
          setDuration(totalDuration);
          setDurationInFrame(totalDuration); // inform parent
          return;
        }
      } catch {}
    }
    setDuration(100);
    setDurationInFrame(100);
  }, [videoData, fps, setDurationInFrame]);
//  console.log("Proxied audio URL:", `/api/audio-proxy?url=${encodeURIComponent(videoData.audioUrl)}`);


  return (
    <div>
      <AbsoluteFill>
        {imageList.map((item, index) => {
          const startTime = (index * duration) / imageList.length;
          const scale = (index) =>
            interpolate(
              frame,
              [startTime, startTime + duration / 2, startTime + duration],
              index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
          return (
            <Sequence
              key={index}
              from={startTime}
              durationInFrames={duration / imageList.length}
            >
              <AbsoluteFill>
                <Img
                  src={`/api/image-proxy?url=${encodeURIComponent(item)}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale(index)})`,
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}

  
<Audio
  src={`/api/audio-proxy?url=${encodeURIComponent(videoData.audioUrl)}`}
  volume={1}
/>


      </AbsoluteFill>
    </div>
  );
}

export default RemotionComposition;
