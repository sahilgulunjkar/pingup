import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import connectionsReducer from '../features/connections/connectionsSlice'
import messageReducer from '../features/messages/messagesSlice'

export const store =configureStore({
    reducer:{
        user:userReducer,
        connections:connectionsReducer,
        messages:messageReducer,
    }
})