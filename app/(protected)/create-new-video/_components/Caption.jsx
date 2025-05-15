'use client'
import React, { useState } from 'react'

const options = [
  {
    name: 'Youtuber',
    value: 'youtuber',
    style: 'text-yellow-400 text-3xl font-extrabold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg'
  },
  {
    name: 'Superme',
    value: 'superme',
    style: 'text-white text-3xl font-bold italic drop-shadow-lg px-3 py-1 rounded-lg'
  },
  {
    name: 'Neon',
    value: 'neon',
    style: 'text-green-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
  },
  {
    name: 'Glitch',
    value: 'glitch',
    style: 'text-pink-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'
  },
  {
    name: 'Fire',
    value: 'fire',
    style: 'text-red-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg'
  }
];

const Caption = ({ onHandleInputChange }) => {
  const [selectedCaption, setSelectedCaption] = useState(null)

  const handleCaptionSelect = (captionValue) => {
    setSelectedCaption(captionValue)
    onHandleInputChange('caption', captionValue)
  }

  return (
    <div className="mt-10">
      <h2>Caption Style</h2>
      <p className='text-sm text-gray-400 mb-1'>Select Caption Style</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {options.map((option) => (
          <div
            key={option.value}
            className={`cursor-pointer p-3 rounded-md transition-all duration-200 bg-gray-900 ${
              selectedCaption === option.value
                ? 'ring-2 ring-gray-100'
                : 'hover:bg-gray-800'
            } flex items-center justify-center`}
            onClick={() => handleCaptionSelect(option.value)}
          >
            <div className={`${option.style} text-center w-full`}>
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Caption