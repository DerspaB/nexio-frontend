import useSWR from 'swr';
import { clientsApi } from '@/lib/api';
import type { Client } from '@nexio/types';

export function useClient(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Client>(
    id ? ['client', id] : null,
    () => clientsApi.getClient(id),
  );

  return {
    client: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
