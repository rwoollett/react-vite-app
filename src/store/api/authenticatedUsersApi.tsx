import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import type { AuthenticatedUser, CurrentUserCheck } from '../../types/authuser';
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
      signUp: builder.mutation<AuthenticatedUser, Partial<AuthenticatedUser>>({
        invalidatesTags: (_result, _error, _user) => {
          return [{ type: 'Users' }, { type: 'CurrentUser' }];
        },
        query: (user) => {
          return {
            url: '/api/v1/users/signup',
            method: 'POST',
            body: {
              email: user.email,
              password: user.password
            }
          };
        }
      }),
      signIn: builder.mutation<AuthenticatedUser, Partial<AuthenticatedUser>>({
        invalidatesTags: (_result, _error, _user) => {
          return [{ type: 'CurrentUser' }];
        },
        query: (user) => {
          return {
            url: '/api/v1/users/signin',
            method: 'POST',
            body: {
              email: user.email,
              password: user.password
            }
          };
        }
      }),
      signOut: builder.mutation<AuthenticatedUser, void>({
        invalidatesTags: (_result, _error, _arg) => {
          return [{ type: 'CurrentUser' }];
        },
        query: () => {
          return {
            url: '/api/v1/users/signout',
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
            url: '/api/v1/users/currentuser',
            method: 'GET',
          };
        }
      }),
      refreshToken: builder.mutation<Partial<AuthenticatedUser>, void>({
        invalidatesTags: (_result, _error, _arg) => {
          return [{ type: 'CurrentUser' }];
        },
        query: () => {
          return {
            url: '/api/v1/users/refreshtoken',
            method: 'POST',
            body: {}
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
  useCurrentUserQuery,
  useRefreshTokenMutation
} = usersApi;
export { usersApi };