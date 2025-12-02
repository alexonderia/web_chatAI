export type HttpMethod = 'GET' | 'POST' | 'DELETE';

interface RequestOptions<TBody> {
  method?: HttpMethod;
  path: string;
  body?: TBody;
  signal?: AbortSignal;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function apiRequest<TResponse, TBody = unknown>({
  path,
  method = 'GET',
  body,
  signal,
}: RequestOptions<TBody>): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export function getBaseUrl() {
  return BASE_URL;
}