import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../features/message/messageSlice';
import groupMessageReducer from '../features/groupMessage/groupMessageSlice'
import useReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    user: useReducer,
    message: messageReducer,
    groupMessage: groupMessageReducer,
  },
});
