import type {
  Exercise,
  ExerciseFilters,
  PaginatedResponse,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createExercisesApi(client: ApiClient) {
  return {
    getExercises(filters?: ExerciseFilters) {
      return client.get<PaginatedResponse<Exercise>>(API_ROUTES.exercises.list, filters);
    },

    getMuscleGroups() {
      return client.get<string[]>(API_ROUTES.exercises.muscleGroups);
    },

    getExercise(id: string) {
      return client.get<Exercise>(API_ROUTES.exercises.detail(id));
    },

    createExercise(data: Partial<Exercise>) {
      return client.post<Exercise>(API_ROUTES.exercises.create, data);
    },

    updateExercise(id: string, data: Partial<Exercise>) {
      return client.patch<Exercise>(API_ROUTES.exercises.update(id), data);
    },

    deleteExercise(id: string) {
      return client.delete<void>(API_ROUTES.exercises.delete(id));
    },
  };
}
