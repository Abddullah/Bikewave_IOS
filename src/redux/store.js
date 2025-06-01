import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../redux/features/auth/authSlice';
import mainReducer from '../redux/features/main/mainSlice';
import chatReducer from '../redux/features/chat/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    main: mainReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
