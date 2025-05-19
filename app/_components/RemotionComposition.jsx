import React from 'react'
import {useVideoConfig} from 'remotion'

function RemotionComposition({videoData}) {
     const captions = videoData.captionJson; 
        const {fps} = useVideoConfig()
        const getDurationFrame = () => {
           const totalDuration = captions[captions.length-1]?.end/1000*fps
        }
  return (
    <div>
      Remotion Compositon
    </div>
  )
}

export default RemotionComposition
