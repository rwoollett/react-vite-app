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
  error?: string
}

const initialState = usersAdapter.getInitialState(
  {
    status: 'idle'
  } as AuthorUserAdaptorProp);

export const fetchAuthor = createAsyncThunk(
  'postusers/fetchAuthor',
  async ({ wsId }: { wsId: string }) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    console.log('wsid api', wsId, apiUrl);

    try {
      const response = await http<{ fetchAuthor: AuthorUser[] }>(
        `${apiUrl}/api/v1/liveposts/user/fetchauthor/${wsId}`,
        {
          method: "GET",
          credentials: "include" as const
        }
      );
      return response.fetchAuthor;

    } catch (err) {
      console.error('fetchAuthor error', err);
      return [];
    }

    //return response.fetchAuthor;
  });

// Warning immutability is obtained with createSclide of RDK
export const usersSlice = createSlice({
  name: 'postusers',
  initialState,
  reducers: {
    removePost: usersAdapter.removeOne,
    refetchAuthor: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAuthor.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchAuthor.fulfilled, (state, action) => {
      state.status = 'succeeded';
      if (action.payload) {
        if (action.payload.length) {
          usersAdapter.upsertOne(state, action.payload[0]);
        }
      }
    });
    builder.addCase(fetchAuthor.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  }
});

export const { refetchAuthor } = usersSlice.actions;
export const { reducer } = usersSlice;
