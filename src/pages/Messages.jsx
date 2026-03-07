import React from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
   const navigate = useNavigate()
  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Talk to your friends and family</p>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-4">
        {dummyConnectionsData.map((user) => (
          <div key={user._id} className="bg-white rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
          >
            {/* Avatar */}
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
  <button
    onClick={() => navigate(`/messages/${user._id}`)}
    className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1'
  >
    <MessageSquare className='w-4 h-4' />
  </button>

  <button
    onClick={() => navigate(`/profile/${user._id}`)}
    className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer'
  >
    <Eye className='w-4 h-4' />
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages