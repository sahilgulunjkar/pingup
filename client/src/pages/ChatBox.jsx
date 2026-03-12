import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ImageIcon, SendHorizonal } from "lucide-react"
import { dummyMessagesData, dummyUserData, dummyConnectionsData } from '../assets/assets'

const ChatBox = () => {

  const { userId } = useParams()

  const messages = dummyMessagesData

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)

  const user =
    dummyConnectionsData.find(u => u._id === userId) || dummyUserData

  const messageEndRef = useRef(null)

  const sendMessage = async () => { }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  return user && (
    <div className='flex flex-col h-screen'>

      {/* HEADER */}
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-40 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>

        <img
          src={user.profile_picture}
          alt=""
          className='size-8 rounded-full'
        />

        <div>
          <p className='font-medium'>{user.full_name}</p>
          <p className='text-sm text-gray-500 -mt-1.5'>
            @{user.username}
          </p>
        </div>

      </div>

      {/* MESSAGES */}
      <div className='p-5 md:px-10 h-full overflow-y-auto'>
        <div>

          {[...messages]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => (

              <div
                key={index}
                className={`flex flex-col mb-3 ${message.from_user_id === dummyUserData._id
                    ? 'items-start'
                    : 'items-end'
                  }`}
              >

                <div
                  className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.from_user_id === dummyUserData._id
                      ? 'rounded-bl-none'
                      : 'rounded-br-none'
                    }`}
                >

                  {message.message_type === 'image' && (
                    <img
                      src={message.media_url}
                      className='w-full max-w-sm rounded-lg mb-1'
                      alt=""
                    />
                  )}

                  <p>{message.text}</p>

                </div>

              </div>

            ))}

          <div ref={messageEndRef} />

        </div>
      </div>

      {/* INPUT BAR */}
      <div className='px-4'>

        <div className='flex items-center gap-3 pl-5 pr-3 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>

          <input
            type="text"
            className='flex-1 outline-none text-slate-700'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />

          <label htmlFor="image">

            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className='h-8 rounded'
              />
            ) : (
              <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
            )}

            <input
              type="file"
              id='image'
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

          </label>
          <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600
          hover: from-indigo-700 hover: to-purple-800 active: scale-95 
          cursor-pointer text-white p-2 rounded-full'>
            <SendHorizonal size={18} />
          </button>

        </div>

      </div>

    </div>
  )
}

export default ChatBox