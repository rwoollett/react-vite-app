import { combineReducers, configureStore, createSelector } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import data from './data'
import ttt from './ttt'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { ipApi } from '../api/ipApi'
import { usersApi } from '../api/authenticatedUsersApi';
import { reducer as postsReducer, postsAdapter } from '../api/postsSlice';
import { reducer as csTokenActionsReducer, csTokenActionsAdapter, type CSTokenAction} from '../api/cstokenSlice';
import { reducer as postUsersReducer, usersAdapter } from '../api/authorUsersSlice';

import { setupListeners } from '@reduxjs/toolkit/query'

const rootReducer = combineReducers({
  data,
  ttt,
  [ipApi.reducerPath]: ipApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  posts: postsReducer,
  postusers: postUsersReducer,
  csTokenActions: csTokenActionsReducer
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

export const createAppSelector = createSelector.withTypes<RootState>();

// CSToken action event selectors
export const {
  selectAll: selectAllTokenActions
} = csTokenActionsAdapter.getSelectors<RootState>(state => state.csTokenActions);

export const selectActionsByClient = createAppSelector(
  [selectAllTokenActions,  (_: RootState, clientIp: string) => clientIp],
  (actions, clientIp) => actions.filter(a => a.clientIp === clientIp)
);

export const selectNewActionsForClient = createAppSelector(
  [selectActionsByClient, (_state, _clientIp: string, lastSeq: number) => lastSeq],
  (actions, lastSeq) => actions.filter(a => a.seqNo > lastSeq)
);

export const selectClientWithLatestAction = createAppSelector(
  selectAllTokenActions,
  (actions) => actions.length ? actions[0].clientIp : null
);

export const selectLatestGlobalAction = createAppSelector(
  selectAllTokenActions,
  (actions) => actions.length ? actions[0] : null
);

export const selectActionsGroupedByClient = createAppSelector(
  selectAllTokenActions,
  (actions) => {
    const map = new Map<string, CSTokenAction[]>();
    for (const action of actions) {
      if (!map.has(action.clientIp)) {
        map.set(action.clientIp, []);
      }
      map.get(action.clientIp)!.push(action);
    }
    return map;
  }
);

// Posts selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors<RootState>(state => state.posts);

// Memoized selector - input selectors+ to one selectors output.
export const selectPostsByUser = createAppSelector(
  [selectAllPosts, (_: RootState, userId: number) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
);

// Author Users selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById
} = usersAdapter.getSelectors<RootState>(state => state.postusers);

export const selectIdByAuth = createAppSelector(
  [selectAllUsers, (_: RootState, authId: string) => authId],
  (users, authId) => users.filter(user => user.authId === authId)
);


