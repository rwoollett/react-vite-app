import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { type AuthorUser } from '../../types';
import { http } from '../../utility/fetchData';

export const usersAdapter = createEntityAdapter<AuthorUser, number>({
  selectId: (user) => {
    return user.id;
  },
});

interface AuthorUserAdaptorProp {
  status: string;
  statusNewUser: string;
  error?: string
}

const initialState = usersAdapter.getInitialState(
  { status: 'idle', statusNewUser: 'idle' } as AuthorUserAdaptorProp);

export const fetchUserByAuthId = createAsyncThunk(
  'postusers/fetchUserByAuthIdStatus',
  async ({ authId }:
    { authId: string }) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const response = await http<{ fetchUserByAuthId: AuthorUser[] }>(
      `${apiUrl}/api/v1/liveposts/user/fetchbyauthid/${authId}`,
      { method: "GET" }
    );
    return response.fetchUserByAuthId;
  });

export const addNewUser = createAsyncThunk(
  'postusers/addNewUserStatusNewUser',
  async ({ name, authId }:
    { name: string, authId: string }) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const reqInit = {
      body: JSON.stringify({ name, authId }),
      method: "PUT",
      credentials: "include" as const
    };
    const response = await http<{ createUser: AuthorUser }>(`${apiUrl}/api/v1/liveposts/users`, reqInit);
    return response.createUser;
  }
);

// export const fetchUsers = createAsyncThunk('postusers/fetchUsers', async () => {
//   const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
//   const response = await http<{ fetchUsers: AuthorUser[] }>(
//     `${apiUrl}/api/v1/users`,
//     { method: "GET" }
//   );
//   return response.fetchUsers;
// });

// Warning immutability is obtained with createSclide of RDK
export const usersSlice = createSlice({
  name: 'postusers',
  initialState,
  reducers: {
    removePost: usersAdapter.removeOne,
    refetchUserByID: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    // builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
    builder.addCase(fetchUserByAuthId.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUserByAuthId.fulfilled, (state, action) => {
      state.status = 'succeeded';
      action.payload.length && usersAdapter.upsertOne(state, action.payload[0]);
    });
    builder.addCase(fetchUserByAuthId.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(addNewUser.pending, (state, _action) => {
      state.statusNewUser = 'loading';
    });
    builder.addCase(addNewUser.fulfilled, (state, action) => {
      state.statusNewUser = 'succeeded';
      return usersAdapter.addOne(state, action.payload);
    });
    builder.addCase(addNewUser.rejected, (state, action) => {
      state.statusNewUser = 'failed';
      state.error = action.error.message;
    });


  }
});

export const { refetchUserByID } = usersSlice.actions;
export const { reducer } = usersSlice;
