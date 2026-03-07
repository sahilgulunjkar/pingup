import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModal = () => {

  const user = dummyUserData

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    full_name: user.full_name,
  })

  const handleSaveProfile = async (e) => {
    e.preventDefault()
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 h-screen overflow-y-scroll bg-black/50'>

      <div className='max-w-2xl sm:py-6 mx-auto'>

        <div className='bg-white rounded-lg shadow p-6'>

          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            Edit Profile
          </h1>

          <form className='space-y-4' onSubmit={handleSaveProfile}>

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
                  setEditForm({
                    ...editForm,
                    profile_picture: e.target.files[0]
                  })
                }
              />

              <div className='group/profile relative mt-2'>

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

                  <Pencil className='w-5 h-5 text-white'/>

                </div>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ProfileModal