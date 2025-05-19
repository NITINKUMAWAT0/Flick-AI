"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import moment from "moment";

function VideoList() {
  const [videoList, setVideoList] = useState([]);
  const convex = useConvex();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      GetUserVideoList();
    }
  }, [userId]);

  const GetUserVideoList = async () => {
    try {
      const user = await convex.query(api.users.getUserByClerkId, {
        clerkUserId: userId,
      });

      if (!user) {
        setVideoList([]);
        return;
      }

      const result = await convex.query(api.videoData.GetUserVideos, {
        uid: user._id,
      });

      console.log("Fetched videos:", result);
      setVideoList(result || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideoList([]);
    }
  };

  return (
    <div className="min-h-[200px">
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
              const parsedImages = JSON.parse(video.images);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                imageUrl = parsedImages[0];
              }
            } catch (err) {
              console.warn("Invalid images JSON:", video.images);
            }

            return (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow hover:cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-gray-900">
                  <Image
                    src={imageUrl}
                    alt="Video thumbnail"
                    fill
                    className="object-cover absolute inset-0"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-white text-base font-semibold truncate">{video?.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {moment(video?._creationTime).fromNow()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VideoList;
