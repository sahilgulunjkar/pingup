import React, { useState, useEffect } from 'react'
import { dummyPostsData, assets } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/Postcard'
import RecentMessages from '../components/RecentMessages'


const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchfeeds = async () => {
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchfeeds()
  }, [])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and Post List */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

      </div>

      {/* Right Sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-mid inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className="w-75 h-49 rounded-md" alt="" />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>Supercharge your marketing with a powerfull, easy-to-use platform built for results</p>
        </div>
        <RecentMessages />

      </div>
    </div>
  ) : <Loading />

}

export default Feed