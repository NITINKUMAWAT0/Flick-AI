'use client'

import React, { useState, useEffect } from 'react'
import VideoInfo from '../_components/VideoInfo';
import VideoPlayer from '../_components/VideoPlayer';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';

const PlayVideo = () => {
    const { videoId } = useParams();
    const convex = useConvex();
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (videoId) {
            GetVideoById();
        }
    }, [videoId]);

    const GetVideoById = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await convex.query(api.videoData.GetVideoById, {
                videoId: videoId,
            });
            
            console.log('Fetched video data:', result);
            setVideoData(result);
            
            if (!result) {
                setError('Video not found');
            }
        } catch (err) {
            console.error('Error fetching video:', err);
            setError('Failed to load video');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='mt-10 mx-10'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
                        <p className='mt-4 text-gray-600'>Loading video...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='mt-10 mx-10'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-center'>
                        <div className='text-red-500 text-xl mb-4'>⚠️</div>
                        <p className='text-red-600 font-medium'>{error}</p>
                        <button 
                            onClick={GetVideoById}
                            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className='mt-10 mx-10'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-center'>
                        <p className='text-gray-600'>Video not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-10 mx-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <VideoPlayer videoData={videoData} />
                <VideoInfo videoData={videoData} />
            </div>
        </div>
    );
}

export default PlayVideo;