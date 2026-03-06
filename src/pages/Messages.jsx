import React from 'react'

const messagesData = [
  {
    id: 1,
    name: "John Warren",
    username: "john_warren",
    bio: "🟢 Dreamer | 📚 Learner | 🚀 Doer Exploring life one step at a time. ✨ Staying curious. Creating with purpose.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
  },
  {
    id: 2,
    name: "Richard Hendricks",
    username: "Richard Hendricks",
    bio: "🟢 Dreamer | 📚 Learner | 🚀 Doer Exploring life one step at a time. ✨ Staying curious. Creating with purpose.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?q=80&w=200"
  },
  {
    id: 3,
    name: "Alexa james",
    username: "alexa_james",
    bio: "🟢 Dreamer | 📚 Learner | 🚀 Doer Exploring life one step at a time. ✨ Staying curious. Creating with purpose.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
  }
]

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
        {messagesData.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
          >
            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages