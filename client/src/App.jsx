import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Layout from './pages/Layout'

import { useUser, useAuth } from '@clerk/clerk-react'
import Loading from './components/Loading'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'

export const App = () => {
  const { user, isLoaded } = useUser()
  const {getToken} = useAuth();

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


  if (!isLoaded) {
    return <Loading />
  }

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
