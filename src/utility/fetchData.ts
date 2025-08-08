
interface FetchConfig {
  body?: string;
  method: string;
  headers?: { [key: string]: string; }
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
    return response.json();
  } catch (err) {
    const error = err as Error;
    return Promise.reject(error.message ? error.message : "");
  }
}