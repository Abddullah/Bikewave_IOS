import { createSlice } from '@reduxjs/toolkit';
import {
  getAllChats,
  getOneChat,
  createChat,
  deleteChat,
  markMessagesAsSeen,
  getMessages,
  sendMessage,
} from './chatThunks';

const initialState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearCurrentChat: state => {
      state.currentChat = null;
      state.messages = [];
    },
  },
  extraReducers: builder => {
    // Get all chats
    builder.addCase(getAllChats.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    });
    builder.addCase(getAllChats.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error.message;
    });

    // Get one chat
    builder.addCase(getOneChat.pending, state => {
      state.loading = true;
    });
    builder.addCase(getOneChat.fulfilled, (state, action) => {
      state.loading = false;
      state.currentChat = action.payload;
    });
    builder.addCase(getOneChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create chat
    builder.addCase(createChat.pending, state => {
      state.loading = true;
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.loading = false;
      state.chats.push(action.payload);
    });
    builder.addCase(createChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder
      .addCase(sendMessage.pending, state => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ ...action.payload, createdAt: new Date().toISOString() });

      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Delete chat
    builder.addCase(deleteChat.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteChat.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = state.chats.filter(chat => chat.id !== action.payload.id);
      if (state.currentChat?.id === action.payload.id) {
        state.currentChat = null;
      }
    });
    builder.addCase(deleteChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Mark messages as seen
    builder.addCase(markMessagesAsSeen.pending, state => {
      state.loading = true;
    });
    builder.addCase(markMessagesAsSeen.fulfilled, (state, action) => {
      state.loading = false;
      if (state.currentChat?.id === action.payload.id) {
        state.currentChat = action.payload;
      }
    });
    builder.addCase(markMessagesAsSeen.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get messages
    builder.addCase(getMessages.pending, state => {
      state.loading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
