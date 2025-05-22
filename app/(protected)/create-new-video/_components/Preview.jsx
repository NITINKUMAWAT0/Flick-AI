import Image from 'next/image';
import React from 'react';
import { options as videoOptions } from './VideoStyle';

const Preview = ({ formData }) => {
  // Find selected video style
  const selectedVideoStyle = formData?.style
    ? videoOptions.find(option => option.name === formData.style)
    : null;

  const captionData = formData?.caption;
  const selectedCaptionText = captionData?.value;
  const selectedCaptionStyle = captionData?.style;

  return (
    <div className="border rounded-lg p-4 h-fit sticky top-4">
      <h3 className="text-xl font-bold mb-4">Video Preview</h3>

      {selectedVideoStyle ? (
        <div className="relative w-full aspect-video mb-4">

          <Image
            src={selectedVideoStyle.image}
            alt={selectedVideoStyle.name}
            width={500}
            height={900}
            className="w-full h-[70vh] object-cover rounded-xl"
          />

          {captionData && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
              <div className={`${selectedCaptionStyle} text-center`}>
                {selectedCaptionText}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Select a style to see preview</p>
        </div>
      )}
    </div>
  );
};

export default Preview;
