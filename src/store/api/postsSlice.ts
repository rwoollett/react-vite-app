import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import type { Post, PostCreate, PostStage, PostUpdate, ReactPost } from '../../types';
import { http } from '../../utility/fetchData';

// Entity adaptor for normalised posts structure; ids end entities.
export const postsAdapter = createEntityAdapter<Post, number>({
  selectId: post => post.id,
  sortComparer: (a, b) => {
    return b.date.localeCompare(a.date);
  }
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
  async ({ title, content, authorUserId, wsId }: PostCreate) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const reqInit = {
      body: JSON.stringify({ title, content, authorUserId, wsId }),
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
    reactionAdded(state, action: PayloadAction<ReactPost>) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    postStage(state, action: PayloadAction<PostStage>) {
      const { id, slug } = action.payload;
      const existingPost = state.entities[id];
      if (existingPost) {
        existingPost.slug = slug;
        //console.log (existingPost);
      }
    },
    upsertPost: (state, action: PayloadAction<Post>) => {
      return postsAdapter.upsertOne(state, action.payload);
    },
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
      return postsAdapter.addOne(state, action.payload);
    });
    // builder.addCase(updatePost.fulfilled, (state, action) => {
    //   const { id, title, content } = action.payload;
    //   const existingPost = state.entities[id];
    //   if (existingPost) {
    //     // immer functionality for immutability
    //     existingPost.title = title;
    //     existingPost.content = content;
    //   }
    // });
  }
});

export const { reactionAdded, postStage } = postsSlice.actions;
export const { reducer } = postsSlice;

