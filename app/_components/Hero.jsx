import { Button } from '@/components/ui/button'
import React from 'react'

const Hero = () => {
  return (
    <div className='p-10 flex flex-col items-center justify-center mt-24 gap-5'>
        <h2 className='font-bold text-6xl text-center'>AI Video Generator</h2>
        <p className='mt-4 text-2xl text-gray-500 text-center'>
        🎬 Create viral Reels, TikToks & YouTube Shorts in seconds! ✨ AI writes the script 📝, adds voice 🎙️, and brings your video to life 🎥🚀.
        </p>

        <div className='flex gap-4 mt-4'>
            <Button size='lg' variant='secondary'>
                Explore
            </Button>

            <Button size="lg">
                Get Started
            </Button>
        </div>
    </div>
  )
}

export default Hero
