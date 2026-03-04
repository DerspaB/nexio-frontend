export const Role = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  CLIENT: 'CLIENT',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ClientStatus = {
  ACTIVE: 'ACTIVE',
  AT_RISK: 'AT_RISK',
  TRIAL: 'TRIAL',
  INACTIVE: 'INACTIVE',
} as const;

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

export const PlanStatus = {
  TEMPLATE: 'TEMPLATE',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;

export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus];

export const BlockType = {
  EXERCISE: 'EXERCISE',
  SUPERSET: 'SUPERSET',
  REST: 'REST',
  NOTE: 'NOTE',
} as const;

export type BlockType = (typeof BlockType)[keyof typeof BlockType];

export const CheckInStatus = {
  COMPLETED: 'COMPLETED',
  PARTIAL: 'PARTIAL',
  SKIPPED: 'SKIPPED',
} as const;

export type CheckInStatus = (typeof CheckInStatus)[keyof typeof CheckInStatus];

export const DESIGN_TOKENS = {
  colors: {
    primary: '#0B2E8A',
    success: '#1E7F4F',
    danger: '#C62828',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  radius: {
    input: 8,
    card: 12,
    button: 8,
    modal: 16,
  },
} as const;

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
  },
  clients: {
    list: '/clients',
    detail: (id: string) => `/clients/${id}`,
    create: '/clients',
    update: (id: string) => `/clients/${id}`,
    delete: (id: string) => `/clients/${id}`,
  },
  exercises: {
    list: '/exercises',
    muscleGroups: '/exercises/muscle-groups',
    detail: (id: string) => `/exercises/${id}`,
    create: '/exercises',
    update: (id: string) => `/exercises/${id}`,
    delete: (id: string) => `/exercises/${id}`,
  },
  plans: {
    list: '/plans',
    detail: (id: string) => `/plans/${id}`,
    create: '/plans',
    update: (id: string) => `/plans/${id}`,
    delete: (id: string) => `/plans/${id}`,
    duplicate: (id: string) => `/plans/${id}/duplicate`,
    assign: (id: string, clientId: string) => `/plans/${id}/assign/${clientId}`,
  },
  workoutDays: {
    create: '/workout-days',
    update: (id: string) => `/workout-days/${id}`,
    delete: (id: string) => `/workout-days/${id}`,
  },
  workoutBlocks: {
    create: '/workout-blocks',
    update: (id: string) => `/workout-blocks/${id}`,
    delete: (id: string) => `/workout-blocks/${id}`,
    reorder: '/workout-blocks/reorder',
  },
  today: {
    my: '/today',
    client: (clientId: string) => `/today/${clientId}`,
  },
  checkIns: {
    create: '/check-ins',
    createForClient: (clientId: string) => `/check-ins/${clientId}`,
    byClient: (clientId: string) => `/check-ins/${clientId}`,
  },
  conversations: {
    list: '/conversations',
    create: '/conversations',
    detail: (id: string) => `/conversations/${id}`,
    messages: (id: string) => `/conversations/${id}/messages`,
    read: (id: string) => `/conversations/${id}/read`,
  },
} as const;
