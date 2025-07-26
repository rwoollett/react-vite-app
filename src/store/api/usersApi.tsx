import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import type { User, CurrentUserCheck } from '../../types/user';
import { baseAuthUrl } from '../../utility/functions';

const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAuthUrl(),
    fetchFn: async (...args) => {
      //DEV ONLY
      //await BundleEnv.pause(10);
      return fetch(...args);
    },
    credentials: "include"
  }),
  tagTypes: ['Users', 'CurrentUser'],
  endpoints(builder) {
    return {
      signUp: builder.mutation<User, Partial<User>>({
        invalidatesTags: (_result, _error, _user) => {
          return [{ type: 'Users' }, { type: 'CurrentUser' }];
        },
        query: (user) => {
          return {
            url: '/api/users/signup',
            method: 'POST',
            body: {
              email: user.email,
              password: user.password
            }
          };
        }
      }),
      signIn: builder.mutation<User, Partial<User>>({
        invalidatesTags: (_result, _error, _user) => {
          return [{ type: 'CurrentUser' }];
        },
        query: (user) => {
          return {
            url: '/api/users/signin',
            method: 'POST',
            body: {
              email: user.email,
              password: user.password
            }
          };
        }
      }),
      signOut: builder.mutation<User, void>({
        invalidatesTags: (_result, _error, _arg) => {
          return [{ type: 'CurrentUser' }];
        },
        query: () => {
          return {
            url: '/api/users/signout',
            method: 'POST'
          };
        }
      }),
      currentUser: builder.query<CurrentUserCheck, void>({
        providesTags: (_result, _error, _arg) => {
          return [{ type: 'CurrentUser' }];
        },
        query: () => {
          return {
            url: '/api/users/currentuser',
            method: 'GET',
          };
        }
      })
    };
  }
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useCurrentUserQuery
} = usersApi;
export { usersApi };