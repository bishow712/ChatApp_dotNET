import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from './userService'

const initialState = {
    registerdUser: '',
    loggedInUser: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const registerUser = createAsyncThunk('user/register', async (user, thunkAPI)=>{
    try {
        return await userService.registerUser(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const loginUser = createAsyncThunk('user/login', async (user, thunkAPI)=>{
    try {
        return await userService.loginUser(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logoutUser = createAsyncThunk('user/logout', async () => {
    await userService.logoutUser()
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder)=>{
        builder
        .addCase(registerUser.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.registerdUser = action.payload
        })
        .addCase(registerUser.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message = action.payload
        })
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.loggedInUser = action.payload
        })
        .addCase(loginUser.rejected, (state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message = action.payload
        })
    }
})

export const {reset} = userSlice.actions

export default userSlice.reducer