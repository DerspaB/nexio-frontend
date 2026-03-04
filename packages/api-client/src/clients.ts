import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  ClientFilters,
  PaginatedResponse,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createClientsApi(client: ApiClient) {
  return {
    getClients(filters?: ClientFilters) {
      return client.get<PaginatedResponse<Client>>(API_ROUTES.clients.list, filters);
    },

    getClient(id: string) {
      return client.get<Client>(API_ROUTES.clients.detail(id));
    },

    createClient(data: CreateClientRequest) {
      return client.post<Client>(API_ROUTES.clients.create, data);
    },

    updateClient(id: string, data: UpdateClientRequest) {
      return client.patch<Client>(API_ROUTES.clients.update(id), data);
    },

    deleteClient(id: string) {
      return client.delete<void>(API_ROUTES.clients.delete(id));
    },
  };
}
