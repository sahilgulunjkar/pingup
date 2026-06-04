import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react' 
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Discover = () => {
  
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  
  const handleSearch = async (e) => {
    if(e.key === 'Enter') {
    try {
      setUsers([])
      setLoading(true)

      const {data} = await api.post('/api/user/discover', {input}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if(data.success) {
        setUsers(data.users)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      setInput('')
    }
    } 
  }

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token))
    })
  },[])

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
        <div className="max-w-6xl mx-auto p-6">
          {/* Title */}
          <div className="mb-8"> 
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
            <p className='text-slate-600'>Find new people to connect with</p>
          </div>

          {/* Search */}
          <div className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80">
            <div className="p-6">
              <div className="relative">
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
                <input 
                  type="text" 
                  placeholder='Search people...' 
                  className='w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400'
                  onChange={(e) => setInput(e.target.value)}
                  onKeyUp={handleSearch}
                  value={input}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {users.map((user) => {
              return <UserCard user={user} key={user._id}/>
            })}
          </div>
          
          {
            loading && (<Loading height='60-vh' />)
          }
        </div>
    </div>
  )
}

export default Discover