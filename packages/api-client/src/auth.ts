import type { AuthResponse, LoginRequest, RegisterRequest } from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createAuthApi(client: ApiClient) {
  return {
    login(data: LoginRequest) {
      return client.post<AuthResponse>(API_ROUTES.auth.login, data);
    },

    register(data: RegisterRequest) {
      return client.post<AuthResponse>(API_ROUTES.auth.register, data);
    },
  };
}
