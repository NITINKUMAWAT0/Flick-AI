'use client';
import React, { useState } from 'react';

export const options = [
  {
    name: 'Youtuber',
    value: 'youtuber',
    style: 'text-yellow-400 text-3xl font-extrabold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg',
  },
  {
    name: 'Superme',
    value: 'superme',
    style: 'text-white text-3xl font-bold italic drop-shadow-lg px-3 py-1 rounded-lg',
  },
  {
    name: 'Neon',
    value: 'neon',
    style: 'text-green-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg',
  },
  {
    name: 'Glitch',
    value: 'glitch',
    style: 'text-pink-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg',
  },
  {
    name: 'Fire',
    value: 'fire',
    style: 'text-red-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg',
  },
];

const Caption = ({ onHandleInputChange }) => {
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(null);

  const handleCaptionSelect = (option) => {
    setSelectedCaptionStyle(option.value);

    onHandleInputChange('caption', {
      value: option.value,
      style: option.style,
    });
  };

  return (
    <div className="mt-5">
      <h2 className="">Caption Style</h2>
      <p className="text-sm text-gray-400">Select Caption Style</p>

      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleCaptionSelect(option)}
            className={`p-2 hover:border bg-slate-900 border-gray-300 cursor-pointer rounded-lg ${
              selectedCaptionStyle === option.value ? 'border-white' : ''
            }`}
          >
            <h2 className={option.style}>{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Caption;
