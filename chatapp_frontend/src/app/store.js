import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../features/message/messageSlice';
import groupMessageReducer from '../features/groupMessage/groupMessageSlice'

export const store = configureStore({
  reducer: {
    message: messageReducer,
    groupMessage: groupMessageReducer,
  },
});
