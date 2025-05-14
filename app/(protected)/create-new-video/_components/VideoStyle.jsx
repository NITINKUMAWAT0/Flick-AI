'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const options = [
  {
    name: 'Realistic',
    image: '/realistic.jpeg'
  },
  {
    name: 'Cartoon',
    image: '/cartoon.jpg'
  },
  {
    name: 'Watercolor',
    image: '/watercolor.jpeg'
  },
  {
    name: 'Cyberpunk',
    image: '/cyberpunk.webp'
  },
  {
    name: 'Anime',
    image: '/anime.jpg'
  },
  {
    name: 'Fantasy',
    image: '/fantasy.jpeg'
  },
]

const VideoStyle = ({ onHandleInputChange }) => {
  const [selectedStyle, setSelectedStyle] = useState(null)

  const handleStyleSelect = (styleName) => {
    setSelectedStyle(styleName)
    onHandleInputChange('style', styleName)
  }

  return (
    <div className='mt-10'>
      <h2>Video Styles</h2>
      <p className='text-sm text-gray-400 mb-1'>Select Video Style</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
        {options?.map((option) => (
          <div 
            key={option.name}
            className={`cursor-pointer transition-all duration-200 ${
              selectedStyle === option.name 
                ? 'ring-2 ring-gray-200 rounded-md p-1' 
                : 'hover:opacity-80'
            }`}
            onClick={() => handleStyleSelect(option.name)}
          >
            <div className="relative">
              <Image 
                src={option.image} 
                alt={option.name} 
                width={100} 
                height={100}
                className="w-full rounded-md object-cover h-[70px] lg:h-[90px] xl:h-[180px]"
              />
              {selectedStyle === option.name && (
                <div className="absolute inset-0 bg-blue-500/20 rounded-md" />
              )}
            </div>
            <p className="text-center mt-2">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoStyle