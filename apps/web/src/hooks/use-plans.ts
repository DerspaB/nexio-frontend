import useSWR from 'swr';
import { plansApi } from '@/lib/api';
import type { PlanFilters, PaginatedResponse, Plan } from '@nexio/types';

export function usePlans(filters: PlanFilters = {}) {
  const key = ['plans', JSON.stringify(filters)];

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Plan>>(
    key,
    () => plansApi.getPlans(filters),
  );

  return {
    plans: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    mutate,
  };
}
