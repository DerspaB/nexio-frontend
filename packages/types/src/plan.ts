export type PlanStatus = 'TEMPLATE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type BlockType = 'EXERCISE' | 'SUPERSET' | 'REST' | 'NOTE';

export interface WorkoutBlock {
  id: string;
  workoutDayId: string;
  type: BlockType;
  order: number;
  exerciseId: string | null;
  exercise?: {
    id: string;
    name: string;
    muscleGroup: string;
    equipment: string | null;
    thumbnailUrl: string | null;
  } | null;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string | null;
}

export interface WorkoutDay {
  id: string;
  planId: string;
  dayOfWeek: number;
  name: string;
  order: number;
  workoutBlocks?: WorkoutBlock[];
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  coachId: string;
  clientId: string | null;
  client?: {
    id: string;
    user: { firstName: string; lastName: string };
  } | null;
  organizationId: string;
  durationWeeks: number;
  isTemplate: boolean;
  status: PlanStatus;
  workoutDays?: WorkoutDay[];
  _count?: { workoutDays: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  isTemplate: boolean;
  durationWeeks: number;
  clientId?: string;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string | null;
  status?: PlanStatus;
  durationWeeks?: number;
}

export interface DuplicatePlanRequest {
  name?: string;
}

export interface AssignPlanRequest {
  clientId: string;
}

export interface CreateWorkoutDayRequest {
  planId: string;
  dayOfWeek: number;
  name: string;
  order: number;
}

export interface UpdateWorkoutDayRequest {
  dayOfWeek?: number;
  name?: string;
  order?: number;
}

export interface CreateBlockRequest {
  workoutDayId: string;
  type: BlockType;
  order: number;
  exerciseId?: string | null;
  sets?: number;
  reps?: string;
  restSeconds?: number;
  notes?: string | null;
}

export interface UpdateBlockRequest {
  type?: BlockType;
  order?: number;
  exerciseId?: string | null;
  sets?: number;
  reps?: string;
  restSeconds?: number;
  notes?: string | null;
}

export interface ReorderBlocksRequest {
  items: { id: string; order: number }[];
}

export interface PlanFilters {
  [key: string]: string | number | boolean | undefined;
  clientId?: string;
  isTemplate?: boolean;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
