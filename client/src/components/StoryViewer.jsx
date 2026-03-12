import React, { useEffect, useState } from 'react'
import { BadgeCheck, X } from 'lucide-react'

const StoryViewer = ({ viewStory, setViewStory }) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer, progressInterval;

    if (viewStory && viewStory.media_type !== 'video') {
      setProgress(0)

      const duration = 10_000;
      const setTime = 100;
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += setTime
        setProgress((elapsed / duration) * 100)
      }, setTime)

      // Close story after some interval
      timer = setTimeout(() => {
        setViewStory(null)
      }, duration)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    }

  }, [viewStory, setViewStory])

  const handleClose = () => {
    setViewStory(null)
  }

  if (!viewStory) return null

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <img
            src={viewStory.media_url}
            className='max-w-full max-h-full object-contain'
          />
        )
      case 'video':
        return (
          <video
            src={viewStory.media_url}
            className='max-h-screen'
            autoPlay
            controls
            onEnded={() => setViewStory(null)}
          />
        )
      case 'text':
        return (
          <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
            {viewStory.content}
          </div>
        )
    }
  }

  return (
    <div
      className='fixed inset-0 h-screen w-full bg-black/95 z-[100] flex items-center justify-center'
      style={{ backgroundColor: viewStory.media_type === "text" ? viewStory.background_color : "rgba(0,0,0,0.95)" }}
    >
      {/* ProgressBar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700 z-[110]'>
        <div
          className='h-full bg-white transition-all duration-100 linear'
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* User info - Top Left */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50 z-[110]'>
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className='size-7 sm:size-8 rounded-full object-cover border border-white'
        />
        <div className='text-white font-medium flex items-center gap-1.5'>
          <span> {viewStory.user?.full_name} </span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* Close button */}
      <button
        className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'
        onClick={handleClose}
      >
        <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
      </button>

      {/* Content Wrapper */}
      <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center '>
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViewer