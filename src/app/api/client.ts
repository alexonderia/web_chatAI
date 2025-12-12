const API_BASE_URL = '/api';

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export class ApiClient {

  async request<T>(path: string, options: globalThis.RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return undefined as T;

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    if (contentLength === '0' || !contentType) {
      return undefined as T;
    }

    const rawBody = await response.text();
    if (!rawBody) {
      return undefined as T;
    }

    const isJson = contentType.includes('application/json');
    return (isJson ? JSON.parse(rawBody) : (rawBody as unknown)) as T;
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();