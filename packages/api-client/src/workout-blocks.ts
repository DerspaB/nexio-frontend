import type {
  WorkoutBlock,
  CreateBlockRequest,
  UpdateBlockRequest,
  ReorderBlocksRequest,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createBlocksApi(client: ApiClient) {
  return {
    createBlock(data: CreateBlockRequest) {
      return client.post<WorkoutBlock>(API_ROUTES.workoutBlocks.create, data);
    },

    updateBlock(id: string, data: UpdateBlockRequest) {
      return client.patch<WorkoutBlock>(API_ROUTES.workoutBlocks.update(id), data);
    },

    deleteBlock(id: string) {
      return client.delete<void>(API_ROUTES.workoutBlocks.delete(id));
    },

    reorderBlocks(data: ReorderBlocksRequest) {
      return client.post<void>(API_ROUTES.workoutBlocks.reorder, data);
    },
  };
}
