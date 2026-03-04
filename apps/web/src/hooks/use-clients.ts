import useSWR from 'swr';
import { clientsApi } from '@/lib/api';
import type { ClientFilters, PaginatedResponse, Client } from '@nexio/types';

export function useClients(filters: ClientFilters = {}) {
  const key = ['clients', JSON.stringify(filters)];

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Client>>(
    key,
    () => clientsApi.getClients(filters),
  );

  return {
    clients: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    mutate,
  };
}
