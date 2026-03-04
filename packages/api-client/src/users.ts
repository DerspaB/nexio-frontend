import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  PaginationQuery,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createUsersApi(client: ApiClient) {
  return {
    getUsers(params?: PaginationQuery) {
      return client.get<PaginatedResponse<User>>(API_ROUTES.users.list, params);
    },

    getUser(id: string) {
      return client.get<User>(API_ROUTES.users.detail(id));
    },

    createUser(data: CreateUserRequest) {
      return client.post<User>(API_ROUTES.users.create, data);
    },

    updateUser(id: string, data: UpdateUserRequest) {
      return client.patch<User>(API_ROUTES.users.update(id), data);
    },
  };
}
