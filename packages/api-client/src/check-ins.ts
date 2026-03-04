import type {
  CheckIn,
  CreateCheckInRequest,
  CheckInFilters,
  PaginatedResponse,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createCheckInsApi(client: ApiClient) {
  return {
    createCheckIn(data: CreateCheckInRequest) {
      return client.post<CheckIn>(API_ROUTES.checkIns.create, data);
    },

    createForClient(clientId: string, data: CreateCheckInRequest) {
      return client.post<CheckIn>(API_ROUTES.checkIns.createForClient(clientId), data);
    },

    getByClient(clientId: string, filters?: CheckInFilters) {
      return client.get<PaginatedResponse<CheckIn>>(
        API_ROUTES.checkIns.byClient(clientId),
        filters,
      );
    },
  };
}
