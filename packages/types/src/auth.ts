import type { Role } from '@nexio/constants';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organizationId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserPayload;
}
