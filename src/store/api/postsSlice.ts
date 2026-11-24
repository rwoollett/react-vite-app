import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import type { Post, PostCreate, PostStage, PostStatusChanged, PostUpdate } from '../../types';
import { http } from '../../utility/fetchData';
import { fetchMyPosts } from './myPostsSlice';

// Entity adaptor for normalised posts structure; ids end entities.
export const postsAdapter = createEntityAdapter<Post, number>({
  selectId: post => post.id,
  sortComparer: (a, b) => b.id - a.id
  // {
  //   return b.date.localeCompare(a.date);
  // }
});

interface PostAdaptorProp {
  status: string;
  error?: string
}

const initialState = postsAdapter.getInitialState(
  { status: 'idle' } as PostAdaptorProp);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const response = await http<{ fetchPosts: Post[] }>(
      `${apiUrl}/api/v1/liveposts/posts`,
      {
        method: "GET",
        credentials: "include"
      }
    );
    return response.fetchPosts;
  });

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async ({ title, content, wsId }: PostCreate) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const reqInit = {
      body: JSON.stringify({ title, content, wsId }),
      method: "PUT",
      credentials: "include" as const
    };
    const response = await http<{ createPost: Post }>(`${apiUrl}/api/v1/liveposts/posts`, reqInit);
    return response.createPost;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, title, content, wsId }: PostUpdate) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const reqInit = {
      body: JSON.stringify({ title, content, wsId }),
      method: "PUT",
      credentials: "include" as const
    };
    const response = await http<{ updatePost: Post }>(`${apiUrl}/api/v1/liveposts/update/post/${postId}`, reqInit);
    console.log('Response put:', response, typeof response);
    return response.updatePost;
  }
);

// Warning on reducer immutabiliy:
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postStatusUpdated: (state, action: PayloadAction<PostStatusChanged>) => {
      const { postId, status } = action.payload;
      const existingPost = state.entities[postId];
      // immer functionality for  
      if (existingPost) {
        existingPost.status = status;
      }

    },
    postPrerenderCompleted: (state, action: PayloadAction<PostStage>) => {
      const { id, slug } = action.payload;
      const post = state.entities[id];
      console.log('prerender has post from addNewPost.fulfilled iin create post workflow', id, post);

      if (post) {
        post.slug = slug; 
        post.prerenderStatus = "Completed";
       console.log('prerender completed');
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      postsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      postsAdapter.addOne(state, action.payload);
    });
    builder.addCase(fetchMyPosts.fulfilled, (state, action) => {
      postsAdapter.upsertMany(state, action.payload);
    }
    );
  }
});

export const { postStatusUpdated, postPrerenderCompleted } = postsSlice.actions;
export const { reducer } = postsSlice;

