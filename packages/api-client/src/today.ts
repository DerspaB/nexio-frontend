import type { TodayResponse } from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createTodayApi(client: ApiClient) {
  return {
    getMyToday() {
      return client.get<TodayResponse>(API_ROUTES.today.my);
    },

    getClientToday(clientId: string) {
      return client.get<TodayResponse>(API_ROUTES.today.client(clientId));
    },
  };
}
