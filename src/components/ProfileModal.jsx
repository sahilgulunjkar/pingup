import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModal = ({ setShowEdit }) => {

  const user = dummyUserData

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  })

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setShowEdit(false)
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 h-screen overflow-y-scroll bg-black/50'>

      <div className='max-w-2xl sm:py-6 mx-auto'>

        <div className='bg-white rounded-lg shadow p-6'>

          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            Edit Profile
          </h1>

          <form className='space-y-5' onSubmit={handleSaveProfile}>

            {/* Profile Picture */}
            <div>
              <label
                htmlFor='profile_picture'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Profile Picture
              </label>

              <input
                type='file'
                accept='image/*'
                id='profile_picture'
                className='w-full p-3 border border-gray-200 rounded-lg'
                onChange={(e) =>
                  setEditForm({ ...editForm, profile_picture: e.target.files[0] })
                }
              />

              <div className='group/profile relative mt-2 w-24 h-24'>
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user.profile_picture
                  }
                  alt=''
                  className='w-24 h-24 rounded-full object-cover'
                />
                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                  <Pencil className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>

            {/* Cover Photo */}
            <div>
              <label
                htmlFor='cover_photo'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Cover Photo
              </label>

              <input
                type='file'
                accept='image/*'
                id='cover_photo'
                className='w-full p-3 border border-gray-200 rounded-lg'
                onChange={(e) =>
                  setEditForm({ ...editForm, cover_photo: e.target.files[0] })
                }
              />

              <div className='mt-2'>
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : user.cover_photo
                  }
                  alt=''
                  className='w-full h-40 object-cover rounded-lg'
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor='full_name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Name
              </label>
              <input
                type='text'
                id='full_name'
                value={editForm.full_name}
                className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Username
              </label>
              <input
                type='text'
                id='username'
                value={editForm.username}
                className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor='bio'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Bio
              </label>
              <textarea
                id='bio'
                rows={4}
                value={editForm.bio}
                className='w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300'
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor='location'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Location
              </label>
              <input
                type='text'
                id='location'
                value={editForm.location}
                className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={() => setShowEdit(false)}
                className='px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition'
              >
                Save Changes
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ProfileModal