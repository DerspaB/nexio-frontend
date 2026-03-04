export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string;
  equipment: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseFilters {
  [key: string]: string | number | undefined;
  muscleGroup?: string;
  equipment?: string;
  search?: string;
  page?: number;
  limit?: number;
}
