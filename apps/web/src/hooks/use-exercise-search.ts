import useSWR from 'swr';
import { exercisesApi } from '@/lib/api';
import type { Exercise, PaginatedResponse } from '@nexio/types';

export function useExerciseSearch(search: string) {
  const { data, error, isLoading } = useSWR<PaginatedResponse<Exercise>>(
    search.length >= 2 ? ['exercises', search] : null,
    () => exercisesApi.getExercises({ search, limit: 20 }),
    { dedupingInterval: 300 },
  );

  const grouped = (data?.data ?? []).reduce<Record<string, Exercise[]>>(
    (acc, ex) => {
      const group = ex.muscleGroup || 'Otro';
      if (!acc[group]) acc[group] = [];
      acc[group].push(ex);
      return acc;
    },
    {},
  );

  return {
    exercises: data?.data ?? [],
    grouped,
    isLoading,
    error,
  };
}
