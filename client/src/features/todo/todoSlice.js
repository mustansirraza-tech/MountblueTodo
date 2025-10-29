import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const addTodo = createAsyncThunk('todo/addTodo', async ({ task, token }) => {
  const response = await axios.post(API_URL, { task }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const deleteTodo = createAsyncThunk('todo/deleteTodo', async ({ id, token }) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const todoSlice = createSlice({
  name: 'todo',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.list = state.list.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
