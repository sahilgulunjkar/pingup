import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, UserPlus, Plus } from 'lucide-react'

const UserCard = ({ user }) => {

    const currentUser = dummyUserData
    const handleConnectionRequest = async (e) => {
        e.preventDefault()

    }

    const handleFollow = async (e) => {
        e.preventDefault()

    }

    return (
        <div key={user._id} className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md">
            <div className="flex flex-col items-center text-center">
                <img src={user.profile_picture} alt="" className='w-24 h-24 rounded-full object-cover mx-auto' />
                <p className='mt-4 font-semibold text-lg'>{user.full_name}</p>
                {user.username && <p className='text-sm text-gray-500'>@{user.username}</p>}
                {user.bio && <p className='mt-2 text-sm text-gray-600 px-2 line-clamp-2'>{user.bio}</p>}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
                {user.location && (
                    <div className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                        <MapPin className='w-3 h-3' />
                        <span>{user.location}</span>
                    </div>
                )}
                <div className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                    <span className="font-medium text-gray-900">{user.followers?.length || 0}</span>
                    <span>Followers</span>
                </div>
            </div>

            <div className="flex mt-4 gap-2">
                {/* Follow Button */}
                <button
                    className='w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                    disabled={currentUser?.following.includes(user._id)}
                    onClick={handleFollow}>
                    <UserPlus className='w-4 h-4' /> {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
                </button>


                {/* Connection Request Button */}
                <button
                    onClick={handleConnectionRequest}
                    className='flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 trasition'>
                    {
                        currentUser?.connections.includes(user._id) ?
                            <MessageCircle className='w-5 h-5 group-hover:scale-105 transition' /> :
                            <Plus className='w-5 h-5 group-hover:scale-105 transition' />
                    }
                </button>
            </div>
        </div>
    )
}

export default UserCard