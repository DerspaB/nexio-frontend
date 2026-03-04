import type { Role } from '@nexio/constants';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  organizationId: string;
  coachId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'COACH' | 'CLIENT';
  coachId?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'COACH' | 'CLIENT';
  coachId?: string | null;
  isActive?: boolean;
}
