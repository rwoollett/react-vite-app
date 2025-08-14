import { combineReducers, configureStore, createSelector } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import data from './data'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { ipApi } from '../api/ipApi'
import { usersApi } from '../api/authenticatedUsersApi';
import { reducer as postsReducer, postsAdapter } from '../api/postsSlice';

import { setupListeners } from '@reduxjs/toolkit/query'

const rootReducer = combineReducers({
  data,
  [ipApi.reducerPath]: ipApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  posts: postsReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['data', 'ip']
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
      .concat(ipApi.middleware)
      .concat(usersApi.middleware)
      //.concat(postsReducer)
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const persistor = persistStore(store)

// Posts selectors
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors<RootState>(state => state.posts);

// Memoized selector - input selectors+ to one selectors output.
export const selectPostsByUser = createSelector(
  [selectAllPosts, (_: RootState, userId: number) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
);
