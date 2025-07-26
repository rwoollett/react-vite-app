import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import data from './data'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { ipApi } from '../api/ipApi'
import { usersApi } from '../api/usersApi';
import { setupListeners } from '@reduxjs/toolkit/query'

const rootReducer = combineReducers({
    data,
    [ipApi.reducerPath]: ipApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage,
        whitelist: ['data','ip']
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
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const persistor = persistStore(store)
