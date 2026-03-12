import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'

const StoriesBar = () => {

    const [stories, setStories] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }

    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* Add Story Card */}
                <div
                    className='rounded-xl shadow-sm min-w-32 max-w-32 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-100 bg-white group'
                    onClick={() => setShowModel(true)}
                >
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        {/* Icon */}
                        <div className='size-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center 
                                        justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white 
                                        transition-all duration-300 shadow-sm'>
                            <Plus className='w-6 h-6' />
                        </div>
                        <p className='text-xs font-bold text-slate-800 text-center tracking-tight'>Create Story</p>
                    </div>

                </div>

                {/* Story Cards */}
                {
                    stories.map((story, index) => (
                        <div
                            onClick={() => (setViewStory(story))}
                            key={index}
                            style={{
                                background: `radial-gradient(at 0% 0%, #c9edf5 0px, transparent 50%), 
                                            radial-gradient(at 100% 0%, #dda1b9 0px, transparent 50%), 
                                            radial-gradient(at 100% 100%, #fffce6 0px, transparent 50%), 
                                            radial-gradient(at 0% 100%, #e0e7ff 0px, transparent 50%)`,
                                backgroundColor: '#fdfcfe'
                            }}
                            className={`relative rounded-xl shadow-sm min-w-32 max-w-32 max-h-40 cursor-pointer
                                hover:shadow-md transition-all duration-300 active:scale-95 overflow-hidden
                                border border-white/40 group
                            `}>
                            {
                                story.media_type !== "text" && (
                                    <div className='absolute inset-0 z-0 bg-black overflow-hidden'>
                                        {
                                            story.media_type === "image" ?
                                                <img
                                                    src={story.media_url}
                                                    alt=""
                                                    className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 group-hover:opacity-80'
                                                />
                                                :
                                                <video
                                                    src={story.media_url}
                                                    autoPlay loop muted
                                                    className='h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 group-hover:opacity-80'
                                                />
                                        }
                                    </div>
                                )
                            }

                            {/* Glass Overlay for Content Area */}
                            <div className='absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-1' />

                            <img
                                src={story.user.profile_picture}
                                alt=""
                                className='absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-white/80 shadow-sm group-hover:scale-110 transition-transform duration-300'
                            />

                            <div className='absolute bottom-2 left-3 z-10 space-y-0.5'>
                                <p className='text-white text-[11px] font-semibold leading-tight truncate max-w-24 drop-shadow-md'>
                                    {story.content || story.user.full_name}
                                </p>
                                <p className='text-white/80 text-[9px] font-medium'>
                                    {moment(story.createdAt).fromNow()}
                                </p>
                            </div>
                        </div>
                    ))
                }

            </div>

            {/* Add Story Model */}
            {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}

            {/* Add view Story Model */}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}

        </div>
    )
}

export default StoriesBar