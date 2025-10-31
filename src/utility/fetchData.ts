import { baseAuthUrl } from "./functions";

interface FetchConfig {
  body?: string;
  method: string;
  headers?: { [key: string]: string; }
  credentials?: RequestCredentials;
}

export async function http<T>(request: string, {
  body,
  ...customConfig }: FetchConfig): Promise<T> {

  const headers = { 'Content-Type': 'application/json' };
  const config: FetchConfig = {
    body,
    ...customConfig,
    headers: {
      ...headers,
    }
  };
  try {
    const response = await fetch(request, config);
    if (response.status === 401) {
      // Try refreshing token
      const refreshRes = await fetch(`${baseAuthUrl()}/api/v1/users/refreshtoken`, {
        method: 'POST',
        credentials: 'include', // send cookie
      });

      if (!refreshRes.ok) throw new Error('Refresh failed');

      // Retry original request
      return (await fetch(request, config)).json();
    }
    return response.json();
  } catch (err) {
    const error = err as Error;
    return Promise.reject(error.message ? error.message : "");
  }
}