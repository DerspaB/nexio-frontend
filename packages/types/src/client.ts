import type { ClientStatus } from '@nexio/constants';

export interface Client {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  coachId: string;
  organizationId: string;
  status: ClientStatus;
  currentStreak: number;
  adherenceRate: number;
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface CreateClientRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  coachId?: string;
}

export interface UpdateClientRequest {
  status?: ClientStatus;
  tags?: string[];
  notes?: string;
}

export interface ClientFilters {
  [key: string]: string | number | undefined;
  status?: string;
  search?: string;
  coachId?: string;
  page?: number;
  limit?: number;
}
