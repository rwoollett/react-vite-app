import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { type AuthorUser } from '../../types';
import { http } from '../../utility/fetchData';

export const usersAdapter = createEntityAdapter<AuthorUser, number>({
  selectId: user => user.id,
});

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk('postusers/fetchUsers', async () => {
  const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
  const response = await http<{ fetchUsers: AuthorUser[] }>(
    `${apiUrl}/api/v1/users`,
    { method: "GET" }
  );
  return response.fetchUsers;
});

// Warning immutability is obtained with createSclide of RDK
export const usersSlice = createSlice({
  name: 'postusers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
  }
});

export const { reducer } = usersSlice;
