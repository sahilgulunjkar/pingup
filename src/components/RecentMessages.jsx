import React, { useState, useEffect } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import { Link } from 'react-router-dom'
import moment from 'moment'
const RecentMessages = () => {

   const [messages, setMessages] = useState([])
   const fetchRecentMessages = async () => {
      setMessages(dummyRecentMessagesData)
   }

    useEffect(() => {
        fetchRecentMessages()
    }, [])
   return (  
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs
    text-slate-800'>
     <h3 className='font-semibold text-slate-8 mb-4'>recent messages</h3>
     <div className="flex flex-col max-h-60 overflow-y-scroll no-scrollbar">
        {
            messages.map((msg, index) => (
              <Link to={`/messages/${msg.from_user_id._id}`} key={index} className="flex items-start gap-2 py-2 hover:bg-slate-100 justify-between">
                <img src={msg.from_user_id.profile_picture} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="w-full">
                <div className="flex justify-between w-full">
                  <p className='font-medium'>{msg.from_user_id.full_name}</p>
                  <p className="text-[10px] text-slate-400">{moment(msg.createdAt).fromNow()}</p>
                </div>
                <div>
                  <p className='text-grey-500'>{msg.text ? msg.text:'Media'}</p>
                </div>
                </div>
                {!msg.seen && <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] flex-shrink-0'>1</p>}
              </Link>

            ) )
        }
     </div>
    </div>
  )
}

export default RecentMessages