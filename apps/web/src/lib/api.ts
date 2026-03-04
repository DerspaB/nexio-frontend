import {
  ApiClient,
  createAuthApi,
  createUsersApi,
  createClientsApi,
  createExercisesApi,
  createPlansApi,
  createDaysApi,
  createBlocksApi,
  createTodayApi,
  createCheckInsApi,
  createMessagingApi,
} from '@nexio/api-client';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = new ApiClient(apiUrl);
export const authApi = createAuthApi(apiClient);
export const usersApi = createUsersApi(apiClient);
export const clientsApi = createClientsApi(apiClient);
export const exercisesApi = createExercisesApi(apiClient);
export const plansApi = createPlansApi(apiClient);
export const daysApi = createDaysApi(apiClient);
export const blocksApi = createBlocksApi(apiClient);
export const todayApi = createTodayApi(apiClient);
export const checkInsApi = createCheckInsApi(apiClient);
export const messagingApi = createMessagingApi(apiClient);
