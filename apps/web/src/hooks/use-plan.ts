import useSWR from 'swr';
import { plansApi } from '@/lib/api';
import type { Plan } from '@nexio/types';

export function usePlan(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Plan>(
    id ? ['plan', id] : null,
    () => plansApi.getPlan(id),
  );

  return {
    plan: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
