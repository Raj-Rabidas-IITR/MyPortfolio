export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// utils/fetcher.ts
export const fetcher = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
