import React from 'react'
import { dummyRecentMessagesData } from '../assets/assets'

const Messages = () => {
  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Talk to your friends and family</p>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-4">
        {dummyRecentMessagesData.map((message) => (
          <div
            key={message._id}
            className="bg-white rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
          >
            {/* Avatar */}
            <img
              src={message.from_user_id.profile_picture}
              alt={message.from_user_id.full_name}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{message.from_user_id.full_name}</h3>
              <p className="text-gray-500 text-sm">@{message.from_user_id.username}</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed whitespace-pre-line">
                {message.from_user_id.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages