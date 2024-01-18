import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageService from './messageService'

const initialState = {
    createdMessage: '',
    allusers: [],
    messageReceiversId: [],
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    errorMessage: '',
}

export const createNewMessage = createAsyncThunk('message/create', async ({newReceiverId, initialMessageToSend}, thunkAPI)=>{
    try {
        return await messageService.createMessage(newReceiverId, initialMessageToSend)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const createMessage = createAsyncThunk('message/create', async ({messageReceiver, messageToSend}, thunkAPI)=>{
    try {
        return await messageService.createMessage(messageReceiver, messageToSend)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const allUsers = createAsyncThunk('message/users', async (_, thunkAPI)=>{
    try {
        return await messageService.allusers()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const messageReceivers = createAsyncThunk('message/receivers', async (_, thunkAPI)=>{
    try {
        return await messageService.messageReceivers()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getMessage = createAsyncThunk('message/get', async (messageReceiver, thunkAPI)=>{
    try {
        return await messageService.getMessages(messageReceiver)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const messageSlice = createSlice({
    name: 'userMessage',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder)=>{
        builder
        .addCase(createMessage.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createMessage.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.errorMessage = ''
            state.createdMessage = action.payload
        })
        .addCase(createMessage.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.errorMessage = action.payload
        })
        .addCase(allUsers.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(allUsers.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.errorMessage = ''
            state.allusers = action.payload
        })
        .addCase(allUsers.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.errorMessage = action.payload
        })
        .addCase(messageReceivers.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(messageReceivers.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.errorMessage = ''
            state.messageReceiversId = action.payload
        })
        .addCase(messageReceivers.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.errorMessage = action.payload
        })
        .addCase(getMessage.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getMessage.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.errorMessage = ''
            state.messages = action.payload
        })
        .addCase(getMessage.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.errorMessage = action.payload
        })
    }
})

export const {reset} = messageSlice.actions

export default messageSlice.reducer