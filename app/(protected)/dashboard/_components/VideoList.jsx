'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';

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
            // First get the Convex user ID from the Clerk userId
            const user = await convex.query(api.users.getUserByClerkId, { clerkUserId: userId });
            
            if (!user) {
                setVideoList([]);
                return;
            }

            const result = await convex.query(api.videoData.GetUserVideos, {
                uid: user._id  // Use the Convex user ID
            });
            setVideoList(result || []);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideoList([]);
        }
    }
    console.log(videoList);
    
    

    return (
        <div className="min-h-[200px] flex items-center justify-center">
            {videoList?.length === 0 && (
                <div className='flex flex-col items-center justify-center mt-12'>
                    <Image 
                        src={'/logo.svg'} 
                        alt='logo' 
                        width={60} 
                        height={60}
                    />
                    <h2 className='text-gray-400 text-lg mt-5'>
                        You don't have any videos created. Create a new one.
                    </h2>
                    <Link href={'/create-new-video'}>
                        <Button className="mt-5">Create New Video</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default VideoList;