import type {
  WorkoutDay,
  CreateWorkoutDayRequest,
  UpdateWorkoutDayRequest,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createDaysApi(client: ApiClient) {
  return {
    createDay(data: CreateWorkoutDayRequest) {
      return client.post<WorkoutDay>(API_ROUTES.workoutDays.create, data);
    },

    updateDay(id: string, data: UpdateWorkoutDayRequest) {
      return client.patch<WorkoutDay>(API_ROUTES.workoutDays.update(id), data);
    },

    deleteDay(id: string) {
      return client.delete<void>(API_ROUTES.workoutDays.delete(id));
    },
  };
}
