import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Layout from './pages/Layout'
import Notification from './components/Notification'

import { useUser, useAuth } from '@clerk/clerk-react'
import Loading from './components/Loading'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage, updateMessage, deleteMessage } from './features/messages/messagesSlice'

export const App = () => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth();
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  const dispatch = useDispatch();
  
  useEffect(() => {
      const fetchData = async () => {
        if(user) {
          const token = await getToken();
          dispatch(fetchUser(token))
          dispatch(fetchConnections(token))
        }
      }
      fetchData();
  },[user, getToken, dispatch])


  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname])

  if (!isLoaded) {
    return <Loading />
  }

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + '/api/message/' + user.id)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "EDIT") {
            dispatch(updateMessage(data.message))
          } else if (data.type === "DELETE") {
            dispatch(deleteMessage(data.id))
          } else {
            const fromUserId = typeof data.from_user_id === 'object' ? data.from_user_id._id : data.from_user_id
            if (pathnameRef.current === '/messages/' + fromUserId) {
              dispatch(addMessage(data))
            } else {
              toast.custom((t) => (
                <Notification t={t} message={data} />
              ), { position: "bottom-right" })
            }
          }
        } catch (error) {
          console.error("SSE parse error:", error)
        }
      }
      return () => {
        eventSource.close()
      }
    } 
  }, [user, dispatch])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}
export default App;
