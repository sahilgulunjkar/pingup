import { ArrowLeft, TextIcon, Upload, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'

const StoryModel = ({ setShowModel, fetchStories }) => {

    const bgColors = [
        "#c9edf5",
        "#dda1b9",
        "#fffce6",
        "#e0e7ff"
    ]
    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [preview, setPreview] = useState(null)

    const { getToken } = useAuth()
    const MAX_VIDEO_DURATION = 60    // seconds
    const MAX_VIDEO_SIZE = 50       // mb


    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type.startsWith("video/")) {
                if (file.size > MAX_VIDEO_SIZE * 1024 * 1024) {
                    toast.error(`Video size must be less than ${MAX_VIDEO_SIZE}MB`)
                    setMedia(null);
                    setPreview(null)
                    return
                }
                const video = document.createElement('video')

                video.preload = 'metadata'
                video.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(video.src)
                    if(video.duration > MAX_VIDEO_DURATION) {
                        toast.error(`Video duration must be less than ${MAX_VIDEO_DURATION}seconds`)
                        setMedia(null);
                        setPreview(null)
                        return
                    } else {
                        setMedia(file)
                        setPreview(URL.createObjectURL(file))
                        setText("")
                        setMode("media")
                    }
                }
                video.src = URL.createObjectURL(file)
            
            } else if (file.type.startsWith("image")) {
                setMedia(file)
                setPreview(URL.createObjectURL(file))
                setText("")
                setMode("media")
            }
        }
    }

    const handleCreateStory = async () => {
        const media_type = mode === 'media' ? (media.type.startsWith('image') ? "image" : "video") : "text"
        
        if(media_type === "text" && !text) {
            throw new Error("Please enter text to create a story")
        }
        
        let formData = new FormData();
        formData.append('content', text)
        formData.append('media_type', media_type)
        formData.append('media', media)
        formData.append('background_color', background)
        
        const token = await getToken()
        const {data} = await api.post('/api/story/create', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(data.success) {
            setShowModel(false)
            fetchStories()
            return data.message || "Story created successfully!"
        } else {
            throw new Error(data.message || "Failed to create story")
        }
    }

    return (
        <div className='fixed inset-0 z-50 h-screen w-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between '>
                    <button
                        className='text-white p-2 cursor-pointer'
                        onClick={() => setShowModel(false)}
                    >
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>

                {/* Create Story text Area */}
                <div
                    className='rounded-lg h-95 flex items-center justify-center relative'
                    style={{ backgroundColor: background }}>
                    {/* Display text or media accordingly */}
                    {
                        mode === "text" && (
                            <textarea
                                className='bg-transparent text-black w-full h-full p-6 text-lg resize-none focus:outline-none'
                                placeholder="What's on your mind?"
                                onChange={(e) => { setText(e.target.value) }}
                                value={text}
                            />
                        )
                    }
                    {
                        mode === "media" && preview && (
                            media?.type.startsWith("image") ? (
                                <img
                                    className='object-contain max-h-full'
                                    src={preview}
                                    alt="preview"
                                />
                            ) :
                                (
                                    <video
                                        className='object-contain max-h-full'
                                        src={preview}
                                    />
                                )
                        )
                    }
                </div>
                {/* Display diff colours to display background colours in create story*/}
                <div className='flex mt-4 gap-2'>
                    {bgColors.map((color) => (
                        <button
                            key={color}
                            className='w-6 h-6 rounded-full ring cursor-pointer'
                            style={{ background: color }}
                            onClick={() => setBackground(color)}
                        />
                    ))}
                </div>
                {/* upload Text and Photo buttons */}
                <div className='flex gap-2 mt-4'>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded
                                ${mode === "text" ? "bg-white text-black" : "bg-zinc-800 text-white"}`}
                        onClick={() => { setMode('text'); setMedia(null); setPreview(null) }}
                    >
                        <TextIcon size={18} /> Text
                    </button>

                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
                            ${mode === "media" ? "bg-white text-black" : "bg-zinc-800"}`}>
                        <input
                            type="file"
                            accept="image/*, video/*"
                            className='hidden'
                            onChange={(e) => {
                                handleMediaUpload(e);
                                setMode('media')
                            }}
                        />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>

                {/* Create Story button */}
                <button
                    className='w-full h-12 bg-zinc-800 text-white p-2 rounded mt-4 flex items-center justify-center gap-2 cursor-pointer'
                    onClick={() => toast.promise(handleCreateStory(), {
                        loading: "Creating story...",
                        success: (msg) => msg,
                        error: (err) => err.message || "Failed to create story!"
                    })}
                >
                    <Sparkle size={18} /> Create Story
                </button>
            </div>
        </div>
    )
}

export default StoryModel