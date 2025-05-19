"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import moment from "moment";
import { RefreshCcw } from "lucide-react";

function VideoList() {
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const convex = useConvex();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      GetUserVideoList();
    }
  }, [userId]);

  const GetUserVideoList = async () => {
    try {
      setIsLoading(true);
      const user = await convex.query(api.users.getUserByClerkId, {
        clerkUserId: userId,
      });

      if (!user) {
        setVideoList([]);
        setIsLoading(false);
        return;
      }

      const result = await convex.query(api.videoData.GetUserVideos, {
        uid: user._id,
      });

      setVideoList(result || []);

      const pendingVideo = result?.find((item) => item.status === "pending");
      if (pendingVideo) {
        GetPendingVideoStatus(pendingVideo);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideoList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const GetPendingVideoStatus = async (pendingVideo) => {
    const intervalId = setInterval(async () => {
      try {
        const result = await convex.query(api.videoData.GetVideoById, {
          videoId: pendingVideo._id,
        });

        if (result?.status === "completed") {
          clearInterval(intervalId);
          GetUserVideoList();
        }
      } catch (error) {
        console.error("Error checking video status:", error);
        clearInterval(intervalId);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 600000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <RefreshCcw className="animate-spin mr-2" />
        <span>Loading videos...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[200px]">
      {videoList.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <Image src="/logo.svg" alt="logo" width={60} height={60} />
          <h2 className="text-gray-400 text-lg mt-5">
            You don't have any videos created. Create a new one.
          </h2>
          <Link href="/create-new-video">
            <Button className="mt-5">Create New Video</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {videoList.map((video, index) => {
            let imageUrl = "/placeholder-video.png";
            try {
              if (video.images) {
                const parsedImages = JSON.parse(video.images);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imageUrl = parsedImages[0];
                }
              }
            } catch (err) {
              console.warn("Invalid images JSON:", video.images);
            }

            return (
              <Link href={`/play-video/${video?._id}`} key={video._id || index}>
                <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow hover:cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-900">
                    {video?.status === "completed" ? (
                      <Image
                        src={imageUrl}
                        alt="Video thumbnail"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={index < 4}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="flex flex-col items-center">
                          <RefreshCcw className="animate-spin mb-2" size={24} />
                          <h2 className="text-white text-sm">Generating...</h2>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h2 className="text-white text-base font-semibold truncate">
                      {video?.title || "Untitled Video"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {video?._creationTime
                        ? moment(video._creationTime).fromNow()
                        : "Recently created"}
                    </p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video?.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {video?.status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VideoList;
