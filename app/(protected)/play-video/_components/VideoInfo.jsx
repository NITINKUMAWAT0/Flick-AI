'use client';

import { ArrowLeft, DownloadIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const VideoInfo = ({ videoData }) => {
  const handleDownload = async () => {
    const url = videoData?.videoUrl;
    if (!url) return alert("No video URL available!");

    const fileName = `${videoData?.title || 'video'}.mp4`;

    const response = await fetch(url);
    const blob = await response.blob();

    // Create temporary URL and link
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl); // Clean up
  };

  return (
    <div className='p-5 border rounded-xl'>
      <Link href={'/dashboard'}>
        <h2 className='flex gap-2 items-center'>
          <ArrowLeft />
          Back to Dashboard
        </h2>
      </Link>
      <div className='flex flex-col gap-3'>
        <h2 className='mt-5'>Project Name: {videoData?.title}</h2>
        <p className='text-gray-500'>Script: {videoData?.script}</p>
        <h2>Video Style: {videoData?.videoStyle}</h2>

        <Button onClick={handleDownload}>
          <DownloadIcon className="mr-2" />
          Export & Download
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
