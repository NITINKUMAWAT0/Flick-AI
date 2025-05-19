import React from 'react'
import VideoList from './_components/VideoList'

const Dashboard = () => {
  return (
      <div className="mt-6 mx-6">
      <h2 className="font-semibold text-3xl">My Videos</h2>
      <VideoList/>
    </div>
  )
}

export default Dashboard
