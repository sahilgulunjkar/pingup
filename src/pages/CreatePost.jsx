import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {

  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const user = dummyUserData;

  // To-Do in backend
  const handleSubmit = async () => {

  }

  return (
    <div className='min-h-screen bg-white p-4 md:p-8'>
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="c">
          <h1 className='text-3xl font-bold text-slate-900 mb-6'>Create Post</h1>
          <p className='text-gray-400 mb-8'>Share your thoughts and moments with the world</p>
        </div>

        {/* Form */}
        <div className="max-w-xl bg-white border border-gray-100 p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">
          {/* Heading */}
          <div className="flex items-center gap-4">
            <img src={user.profile_picture} className='w-12 h-12 rounded-full shadow' />
            <div className="c">
              <h2 className='font-bold text-slate-800'>{user.full_name}</h2>
              <p className='text-gray-500 text-sm'>@{user.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            placeholder="What's happening?"
            className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400'
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Images */}
          {
            images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      className='w-full h-24 object-cover rounded-md'
                    />
                    <div
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className='w-4 h-4 text-white' />
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <label
              className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'
              htmlFor="images">
              <Image className='size-6' />
            </label>
            <input
              type="file"
              id="images"
              accept='image/*'
              multiple
              onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
              className='hidden'
            />

            <button
              className='bg-slate-800 text-white px-6 py-2 rounded-full hover:bg-slate-900 transition-all font-medium shadow-sm active:scale-95 cursor-pointer'
              disabled={loading}
              onClick={() => {
                toast.promise(
                  handleSubmit(),
                  {
                    loading: 'uploading ...',
                    success: <p>Post Added</p>,
                    error: <p>Something went wrong</p>
                  }
                )
              }}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost