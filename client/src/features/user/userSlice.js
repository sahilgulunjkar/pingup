import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios.js';
import { toast } from 'react-hot-toast'

const initialState = {
    value: null,
};

// Thunk: Fetch user
export const fetchUser = createAsyncThunk('user/fetchUser', async (token) => {
    const { data } = await api.get('/api/user/data', {
            headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data.success ? data.user : null;
  }
)

// Thunk: Update user
export const updateUser = createAsyncThunk( 'user/update', async ({ userData, token }) => {
    const { data } = await api.post('/api/user/update', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (data.success) {
      toast.success(data.message);
      return data.user;
    } else {
      toast.error(data.message);
      return null;
    }
  }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    //  return fullfilled action data into state value or reject
    extraReducers: (builder) => {
      builder
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.value = action.payload;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
          state.value = action.payload;
        })
    }
});

export default userSlice.reducer;