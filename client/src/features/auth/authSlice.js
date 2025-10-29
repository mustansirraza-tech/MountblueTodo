import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Async thunk for registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
});

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
});

// Initialize token from localStorage for persistence
const initialState = { 
  user: null, 
  token: localStorage.getItem('token') || null, 
  status: 'idle', 
  error: null 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; })
      .addCase(registerUser.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { id: action.payload.userId, name: action.payload.name };
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token); // Save token to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
