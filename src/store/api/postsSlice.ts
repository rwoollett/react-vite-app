import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import type { Post, ReactPost } from '../../types';
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
  'posts/fetchPostsStatus',
  async () => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const response = await http<{ fetchPosts: Post[] }>(
      `${apiUrl}/api/v1/posts`,
      { method: "GET" }
    );
    return response.fetchPosts;
  });

export const addNewPost = createAsyncThunk(
  'posts/addNewPostStatus',
  async ({ title, content, user }:
    { title: string, content: string, user: string }) => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    const reqInit = {
      body: JSON.stringify({ title, content, user }),
      method: "PUT"
    };
    const response = await http<{ createPost: Post }>(`${apiUrl}/api/v1/posts`, reqInit);
    return response.createPost;
  }
);

// export const updatePost = createAsyncThunk(
//   'posts/updatePost',
//   // The payload creator receives the partial `{title, content, user}` object
//   async ({ id, title, content, user, date, reactions }: Post) => {
//     //  { id: string, title: string, content: string }) => {
//     // We send the data to the fake API server
//     const reqInit = {
//       body: JSON.stringify({
//         post: { id, title, content, user, date, reactions }
//       }),
//       method: "PUT"
//     };
//     console.log('Response before put:', reqInit);
//     const response = await http<Post>('/api/v1/posts', reqInit);
//     // The response includes the complete post object, including unique ID
//     console.log('Response put:', response, typeof response);
//     return response;
//   }
// );

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
    upsertPost: (state, action: PayloadAction<Post>) => {
      return postsAdapter.upsertOne(state, action.payload);
    },
    //addPosts: postsAdapter.addMany,
    //updatePost: postsAdapter.updateOne,
    //removePost: postsAdapter.removeOne
    // postUpdated(state, action: PayloadAction<Post>) {
    //   const { id, title, content } = action.payload;
    //   const existingPost = state.entities[id];
    //   if (existingPost) {
    //     // immer functionality for immutability
    //     existingPost.title = title;
    //     existingPost.content = content;
    //   }
    // }
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
      return postsAdapter.addOne(state, action);
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
//postUpdated,
export const { reactionAdded } = postsSlice.actions;
export const { reducer } = postsSlice;

