// src/features/messages/messageSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";

const initialState = { messages: [] };

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ token, userId }) => {
    try {
      const { data } = await api.post(
        "/api/message/get",
        { to_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.success ? data : { success: false, messages: [] };
    } catch (error) {
      toast.error(error.message);
      return { success: false, messages: [] };
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => { state.messages = action.payload; },
    addMessage: (state, action) => { state.messages = [...state.messages, action.payload]; },
    resetMessages: (state) => { state.messages = []; },
    updateMessage: (state, action) => {
      const idx = state.messages.findIndex((m) => m._id === action.payload._id);
      if (idx !== -1) state.messages[idx] = action.payload;
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload?.messages) state.messages = action.payload.messages;
    });
  },
});

// ✅ export ALL actions you use
export const {
  addMessage,
  setMessages,
  resetMessages,
  updateMessage,
  deleteMessage,
} = messageSlice.actions;

export default messageSlice.reducer;