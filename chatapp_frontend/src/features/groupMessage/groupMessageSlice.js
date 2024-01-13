import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import groupMessageService from './groupMessageService'

const initialState = {
    groupMessages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getGroupMessages = createAsyncThunk('groupmessage/getAll', async (_, thunkAPI)=>{
    try {
        return await groupMessageService.getGroupMessages()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const groupMessageSlice = createSlice({
    name: 'groupMessage',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getGroupMessages.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getGroupMessages.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.groupMessages = action.payload
        })
        .addCase(getGroupMessages.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message = action.payload
        })
    }
})

export const {reset} = groupMessageSlice.actions

export default groupMessageSlice.reducer