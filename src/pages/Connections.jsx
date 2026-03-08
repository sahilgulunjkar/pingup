import React, { useState } from 'react'
import { User, UserPlus, UserCheck, Pen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'

const Connections = () => {

  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('Followers')
  const dataArray = [
    { label: 'Followers', value: followers, icon: User },
    { label: 'Following', value: following, icon: UserPlus },
    { label: 'Connections', value: connections, icon: UserCheck },
    { label: 'Pending Connections', value: pendingConnections, icon: Pen }
  ]

  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='max-w-4xl mx-auto p-6'>

        {/* title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="text-gray-500 mt-1">Message your network and discover new connections</p>
        </div>

        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>
                {item.value.length}
              </b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>
        {/*Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {
            dataArray.map((tab) => (
              <button onClick={() => setCurrentTab(tab.label)} key={tab.label} className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab === tab.label ? 'bg-white font-medium text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}>

                <tab.icon className='w-4 h-4' />
                <span className='ml-1'>{tab.label}</span>
                {tab.value && (
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                    {tab.value.length}
                  </span>
                )}
              </button>
            ))
          }

        </div>

        {/*connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item) => item.label === currentTab)?.value.map((user) => (
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt="" className='w-16 h-16 rounded-full object-cover' />
              <div className='flex-1'>
                <p className='font-medium text-gray-900'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio.slice(0, 30)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  {
                    <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-700 active:scale-95 transition text-white cursor-pointer'>

                      view profile
                    </button>
                  }
                  {
                    currentTab === 'Following' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>

                        Unfollow
                      </button>
                    )

                  }
                  {
                    currentTab === 'Pending Connections' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>

                        Accept
                      </button>
                    )

                  }
                  {
                    currentTab === 'Connections' && (
                      <button onClick={() => navigate(`/messages/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'>
                        <MessageSquare className='w-4 h-4' />
                        Message
                      </button>
                    )

                  }
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



export default Connections
