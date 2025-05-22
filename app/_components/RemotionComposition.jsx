'use client';
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
  const [duration, setDuration] = useState(100);
  const [captions, setCaptions] = useState([]);
  const frame = useCurrentFrame();

  // Parse images
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

  // Parse captions and calculate duration
  useEffect(() => {
    if (videoData?.captionJson) {
      try {
        const parsed = JSON.parse(videoData.captionJson);
        const words = parsed.words || [];
        setCaptions(words);

        if (words.length > 0) {
          const totalDuration = Math.ceil(words[words.length - 1].end * fps);
          setDuration(totalDuration);
          setDurationInFrame(totalDuration);
          return;
        }
      } catch {}
    }
    setCaptions([]);
    setDuration(100);
    setDurationInFrame(100);
  }, [videoData, fps, setDurationInFrame]);

  // Get current caption text
  const getCurrentCaptions = () => {
    const currentTime = frame / fps;
    const currentWord = captions.find(
      (item) => currentTime >= item.start && currentTime <= item.end
    );
    return currentWord?.punctuated_word || '';
  };

  return (
    <div>
      <AbsoluteFill>
        {imageList.map((item, index) => {
          const startTime = (index * duration) / imageList.length;
          const scale = (index) =>
            interpolate(
              frame,
              [startTime, startTime + duration / 2, startTime + duration],
              index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
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
      </AbsoluteFill>

  <AbsoluteFill
  style={{
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    height: 150,
    top:undefined,
    textAlign: "center",
    display: "flex", // Needed for centering
  }}
>
  <h2
    className={`text-7xl ${videoData.caption?.style || "text-white"}`}
  >
    {getCurrentCaptions()}
  </h2>
</AbsoluteFill>


      <Audio
        src={`/api/audio-proxy?url=${encodeURIComponent(videoData.audioUrl)}`}
        volume={1}
      />
    </div>
  );
}

export default RemotionComposition;