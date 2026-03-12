import React from 'react'
import { BadgeCheck, Calendar, MapPin, PenBox } from 'lucide-react'
import moment from 'moment'


const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
    return (
        <div className="relative py-4 px-6 md:px-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* User profile picture */}
                <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full overflow-hidden">
                    <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                </div>

                {/* User info */}
                <div className="w-full pt-16 md:pt-0 md:pl-36">
                    <div className="flex flex-col md:flex-row items-start justify-between w-full">
                        <div className="">
                            <div className="flex items-center gap-3">
                                <h1 className='text-2xl font-bold text-gray-900'>
                                    {user.full_name}
                                </h1>
                                <BadgeCheck className='w-6 h-6 text-blue-500' />
                            </div>
                            <p className='text-gray-600 '>
                                {user.username ? `@${user.username}` : `@${user._id}`}
                            </p>
                        </div>

                        {/*  If user is not on other user's profile */}
                        {!profileId && (
                            <button
                                className='flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ease-in-out mt-2 md:mt-0 cursor-pointer'
                                onClick={() => setShowEdit(true)}>
                                <PenBox className='w-4 h-4' />
                                Edit Profile
                            </button>
                        )}
                    </div>
                    <p className='text-gray-700 text-sm max-w-md mt-4'>
                        {user.bio}
                    </p>

                    {/* Display location and join date */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-500">
                        <span className='flex items-center gap-1.5'>
                            <MapPin className='w-4 h-4' />
                            {user.location ? user.location : 'Add location'}
                        </span>

                        <span className='flex items-center gap-1.5'>
                            <Calendar className='w-4 h-4' />
                            Joined <span> {moment(user.createdAt).fromNow()} </span>
                        </span>
                    </div>

                    {/* Display stats */}
                    <div className="flex items-center gap-6 mt-4 border-t border-gray-300 pt-4">
                        <div className="flex flex-col items-center">
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {posts.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500'>
                                Posts
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {user.followers.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500'>
                                Followers
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {user.following.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500'>
                                Following
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo