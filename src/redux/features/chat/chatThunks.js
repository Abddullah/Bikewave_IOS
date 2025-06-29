import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiManager from '../../../api/ApiManager';
import getErrorMessage from '../../../services/errorHandler';
import axios from 'axios';
// import { selectChatLoading, selectChatError, selectAllChats, selectCurrentChat } from '../redux/features/chat/chatSelectors';

// Get all chats
export const getAllChats = createAsyncThunk(
  'chat/fetchAll',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get('/chat', {
        headers: { Authorization: `${token}` },
      });
      console.log(response.data, '______get all chats______');

      return response.data;
    } catch (error) {
      console.log(error, '______error______');
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch chats'));
      }
    }
  },
);

// Get one specific chat
export const getOneChat = createAsyncThunk(
  'chat/fetchOne',
  async (secondUserId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get(`/chat/find/${secondUserId}`, {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch chat'));
      }
    }
  },
);

// Get all messages of a specific chat
export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (currentChatId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get(`/messages/${currentChatId}`, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch messages'));
      }
    }
  },
);

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.post('/messages', message, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to send message'));
      }
    }
  },
);

// Create new chat
export const createChat = createAsyncThunk(
  'chat/create',
  async (receiverId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.post(
        '/chat',
        { receiverId },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to create chat'));
      }
    }
  },
);

// Delete chat
export const deleteChat = createAsyncThunk(
  'chat/delete',
  async (chatId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.delete(`/chat/${chatId}`, {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to delete chat'));
      }
    }
  },
);

// Mark messages as seen
export const markMessagesAsSeen = createAsyncThunk(
  'chat/markSeen',
  async (chatId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.patch(`/chat/${chatId}/seen`, null, {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to mark messages as seen'));
      }
    }
  },
);
