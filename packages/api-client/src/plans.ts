import type {
  Plan,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanFilters,
  PaginatedResponse,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createPlansApi(client: ApiClient) {
  return {
    getPlans(filters?: PlanFilters) {
      const params: Record<string, string | number | undefined> = {};
      if (filters) {
        if (filters.clientId) params.clientId = filters.clientId;
        if (filters.isTemplate !== undefined) params.isTemplate = String(filters.isTemplate);
        if (filters.status) params.status = filters.status;
        if (filters.search) params.search = filters.search;
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
      }
      return client.get<PaginatedResponse<Plan>>(API_ROUTES.plans.list, params);
    },

    getPlan(id: string) {
      return client.get<Plan>(API_ROUTES.plans.detail(id));
    },

    createPlan(data: CreatePlanRequest) {
      return client.post<Plan>(API_ROUTES.plans.create, data);
    },

    updatePlan(id: string, data: UpdatePlanRequest) {
      return client.patch<Plan>(API_ROUTES.plans.update(id), data);
    },

    deletePlan(id: string) {
      return client.delete<void>(API_ROUTES.plans.delete(id));
    },

    duplicatePlan(id: string) {
      return client.post<Plan>(API_ROUTES.plans.duplicate(id));
    },

    assignPlan(id: string, clientId: string) {
      return client.post<Plan>(API_ROUTES.plans.assign(id, clientId));
    },
  };
}
