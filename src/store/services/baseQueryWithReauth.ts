import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { baseAuthUrl } from '../../utility/functions';

const baseQuery = fetchBaseQuery({
  baseUrl: baseAuthUrl(),
  credentials: 'include', // send cookies (for refresh token)
});

export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/api/v1/users/refreshtoken', method: 'POST' },
      api,
      extraOptions
    );
    if (refreshResult.meta?.response?.ok) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
