export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      params?: Record<string, string | number | undefined>;
      headers?: Record<string, string>;
    },
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: this.buildHeaders(options?.headers),
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => undefined);
      throw new ApiError(response.status, response.statusText, data);
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>('GET', path, { params });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, { body });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, { body });
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}
