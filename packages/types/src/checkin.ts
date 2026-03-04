export interface CheckIn {
  id: string;
  clientId: string;
  workoutDayId: string | null;
  completed: boolean;
  mood: number | null;
  energyLevel: number | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  workoutDay?: {
    id: string;
    name: string;
    dayOfWeek: number;
  } | null;
}

export interface TodayResponse {
  hasPlan: boolean;
  isRestDay?: boolean;
  message?: string;
  plan?: {
    id: string;
    name: string;
  } | null;
  workout?: {
    id: string;
    dayOfWeek: number;
    name: string;
    sortOrder: number;
    blocks: Array<{
      id: string;
      sortOrder: number;
      sets: number;
      reps: string;
      restSeconds: number;
      notes: string | null;
      exercise: {
        id: string;
        name: string;
        muscleGroup: string;
        equipment: string | null;
        thumbnailUrl: string | null;
      };
    }>;
  } | null;
  client?: {
    id: string;
    name: string;
  };
  checkedIn: boolean;
  checkIn?: CheckIn | null;
}

export interface CreateCheckInRequest {
  date: string;
  status: 'COMPLETED' | 'PARTIAL' | 'SKIPPED';
  workoutDayId?: string;
  completedBlocks: number;
  totalBlocks: number;
  notes?: string;
  durationMinutes?: number;
}

export interface CheckInFilters {
  [key: string]: string | number | undefined;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
