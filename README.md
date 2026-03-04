# nexio-app

Frontend monorepo for Nexio, a fitness coaching platform for LATAM.
Serves: web dashboard (coaches) and mobile app (clients).

## Stack

- **Next.js 14** — App Router, TypeScript (web dashboard)
- **Expo / React Native** — Mobile client app
- **pnpm Workspaces** — Monorepo package management
- **Turborepo** — Build orchestration and caching
- **Zod** — Schema validation (shared with backend)
- **SWR** — Data fetching with caching and revalidation
- **Lucide React** — Icon system

## Prerequisites

- Node.js 18+
- pnpm 9+
- Backend running on `http://localhost:3001/api` ([nexio-api](../Backend/README.md))

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start dev server (port 3000)
pnpm dev
```

## Project structure

```
├── apps/
│   ├── web/                         # Next.js 14 — Coach dashboard
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/          # Login, Register (public routes)
│   │       │   └── (dashboard)/     # Protected routes (requires JWT)
│   │       │       ├── dashboard/   # Home page
│   │       │       ├── clients/     # Clients list (table, filters, search)
│   │       │       └── clients/[id] # Client detail (tabs: General, Plan, Check-ins)
│   │       ├── components/
│   │       │   └── features/
│   │       │       └── clients/     # ClientsTable, ClientStatusPill, CreateClientModal, etc.
│   │       ├── hooks/               # useClients, useClient (SWR hooks)
│   │       └── lib/
│   │           └── api.ts           # API client instance
│   └── mobile/                      # Expo — Client app (scaffold)
│       └── app/
│           └── (tabs)/              # Tab-based navigation
├── packages/
│   ├── types/                       # Shared TypeScript interfaces
│   ├── validations/                 # Shared Zod schemas (mirrors backend DTOs)
│   ├── api-client/                  # Typed HTTP client (fetch-based)
│   └── constants/                   # Enums, design tokens, API route map
├── turbo.json                       # Turborepo pipeline config
├── pnpm-workspace.yaml              # Workspace definitions
└── tsconfig.json                    # Base TypeScript config
```

## Scripts

| Command                           | Description                 |
| --------------------------------- | --------------------------- |
| `pnpm dev`                        | Start all apps in dev mode  |
| `pnpm dev --filter=@nexio/web`    | Start web only (port 3000)  |
| `pnpm dev --filter=@nexio/mobile` | Start Expo only             |
| `pnpm build`                      | Build all packages and apps |
| `pnpm lint`                       | Lint all packages and apps  |

## Packages

### @nexio/types

Shared TypeScript interfaces mirroring backend API responses.

| Export                 | Description                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `User`                 | Full user object (id, email, role, organizationId, etc.)                                     |
| `AuthResponse`         | Login/register response (accessToken + user)                                                 |
| `LoginRequest`         | Login payload (email, password)                                                              |
| `RegisterRequest`      | Register payload (email, password, names, org)                                               |
| `CreateUserRequest`    | Create user payload (email, password, names, role)                                           |
| `UpdateUserRequest`    | Partial update payload (names, role, isActive)                                               |
| `PaginatedResponse<T>` | Generic paginated list (data, total, page, limit, totalPages)                                |
| `PaginationQuery`      | Query params for pagination (page, limit)                                                    |
| `UserPayload`          | JWT user data stored client-side                                                             |
| `Client`               | Client object (id, userId, user, coachId, status, currentStreak, adherenceRate, tags, notes) |
| `CreateClientRequest`  | Create client payload (email, firstName, lastName, password, coachId?)                       |
| `UpdateClientRequest`  | Partial update payload (status?, tags?, notes?)                                              |
| `ClientFilters`        | Query filters (status?, search?, coachId?, page?, limit?)                                    |

### @nexio/validations

Zod schemas for form validation. Mirrors backend DTOs exactly.

| Export                  | Schema                                      | Rules                                              |
| ----------------------- | ------------------------------------------- | -------------------------------------------------- |
| `loginSchema`           | email + password                            | Email format, password required                    |
| `registerSchema`        | email + password + names + org              | Email format, password min 8, all fields required  |
| `createUserSchema`      | email + password + names + role             | Role enum (ADMIN, COACH, CLIENT), optional coachId |
| `updateUserSchema`      | partial names + role + isActive             | All fields optional, coachId nullable              |
| `paginationQuerySchema` | page + limit                                | page min 1, limit 1-100, defaults 1/10             |
| `createClientSchema`    | email + names + password + coachId?         | Email format, password min 8, all required         |
| `updateClientSchema`    | status? + tags? + notes?                    | Status enum (ACTIVE, AT_RISK, TRIAL, INACTIVE)     |
| `clientFiltersSchema`   | status? + search? + coachId? + page + limit | All optional, pagination defaults 1/10             |

### @nexio/api-client

Typed HTTP client built on `fetch`. No external dependencies.

```typescript
import { ApiClient, createAuthApi, createUsersApi } from '@nexio/api-client';

const client = new ApiClient('http://localhost:3001/api');

// Auth (public)
const authApi = createAuthApi(client);
await authApi.login({ email, password });        // POST /auth/login
await authApi.register({ ... });                  // POST /auth/register

// Users (requires JWT)
client.setToken(accessToken);
const usersApi = createUsersApi(client);
await usersApi.getUsers({ page: 1, limit: 10 }); // GET /users?page=1&limit=10
await usersApi.getUser(id);                       // GET /users/:id
await usersApi.createUser({ ... });               // POST /users
await usersApi.updateUser(id, { ... });           // PATCH /users/:id

// Clients (requires JWT)
const clientsApi = createClientsApi(client);
await clientsApi.getClients({ status: 'ACTIVE' });  // GET /clients?status=ACTIVE
await clientsApi.getClient(id);                      // GET /clients/:id
await clientsApi.createClient({ ... });              // POST /clients
await clientsApi.updateClient(id, { ... });          // PATCH /clients/:id
await clientsApi.deleteClient(id);                   // DELETE /clients/:id
```

### @nexio/constants

| Export          | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `Role`          | Enum object: `OWNER`, `ADMIN`, `COACH`, `CLIENT`           |
| `ClientStatus`  | Enum object: `ACTIVE`, `AT_RISK`, `TRIAL`, `INACTIVE`      |
| `DESIGN_TOKENS` | Colors, spacing (8pt grid), border radius                  |
| `API_ROUTES`    | Route map for all backend endpoints (auth, users, clients) |

## API endpoints covered

| Method | Route            | Auth   | Roles               | Function                    |
| ------ | ---------------- | ------ | ------------------- | --------------------------- |
| POST   | `/auth/register` | Public | —                   | `authApi.register()`        |
| POST   | `/auth/login`    | Public | —                   | `authApi.login()`           |
| GET    | `/users`         | JWT    | OWNER, ADMIN        | `usersApi.getUsers()`       |
| GET    | `/users/:id`     | JWT    | OWNER, ADMIN        | `usersApi.getUser()`        |
| POST   | `/users`         | JWT    | OWNER, ADMIN        | `usersApi.createUser()`     |
| PATCH  | `/users/:id`     | JWT    | OWNER, ADMIN        | `usersApi.updateUser()`     |
| GET    | `/clients`       | JWT    | OWNER, ADMIN, COACH | `clientsApi.getClients()`   |
| GET    | `/clients/:id`   | JWT    | OWNER, ADMIN, COACH | `clientsApi.getClient()`    |
| POST   | `/clients`       | JWT    | OWNER, ADMIN, COACH | `clientsApi.createClient()` |
| PATCH  | `/clients/:id`   | JWT    | OWNER, ADMIN, COACH | `clientsApi.updateClient()` |
| DELETE | `/clients/:id`   | JWT    | OWNER, ADMIN        | `clientsApi.deleteClient()` |

## Authentication flow

1. User submits login/register form
2. Frontend sends credentials to backend via `@nexio/api-client`
3. Backend validates and returns JWT + user payload
4. Frontend stores `token` and `user` in `localStorage`
5. `ApiClient.setToken()` attaches `Authorization: Bearer {jwt}` to all subsequent requests
6. Dashboard layout checks `localStorage` on mount; redirects to `/login` if missing

## Design tokens

| Token        | Value                      |
| ------------ | -------------------------- |
| Primary      | `#0B2E8A`                  |
| Success      | `#1E7F4F`                  |
| Danger       | `#C62828`                  |
| Background   | `#F5F7FA`                  |
| Spacing grid | 8pt (4, 8, 16, 24, 32, 48) |
| Input radius | 8px                        |
| Card radius  | 12px                       |
| Modal radius | 16px                       |

## Conventions

- **UI language**: Spanish
- **Code comments**: English (only when necessary)
- **Icons**: Lucide React (no emojis)
- **Loading states**: Skeleton loaders (no spinners)
- **Empty states**: Always include a CTA
- **API URL**: Never hardcoded; uses `NEXT_PUBLIC_API_URL` env var
- **Feature components**: `components/features/`
- **Custom hooks**: `hooks/`

## Environment variables

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Web dashboard pages

| Route           | Description                                                                              | Components                                                               |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/login`        | Login form with Zod validation                                                           | —                                                                        |
| `/register`     | Register form (creates org + owner)                                                      | —                                                                        |
| `/dashboard`    | Home with placeholder cards                                                              | —                                                                        |
| `/clients`      | Client list with table, search (debounce 300ms), status filter, pagination, create modal | `ClientsTable`, `ClientStatusPill`, `CreateClientModal`                  |
| `/clients/[id]` | Client detail with tabs (General, Plan, Check-ins), editable status, tags, notes         | `ClientHeader`, `ClientGeneralTab`, `ClientPlanTab`, `ClientCheckInsTab` |

## Hooks

| Hook                  | File                   | Description                                      |
| --------------------- | ---------------------- | ------------------------------------------------ |
| `useClients(filters)` | `hooks/use-clients.ts` | SWR fetch for paginated client list with filters |
| `useClient(id)`       | `hooks/use-client.ts`  | SWR fetch for single client by ID                |

## Role isolation

| Role          | Access                                           |
| ------------- | ------------------------------------------------ |
| OWNER / ADMIN | Full dashboard, manage all users in organization |
| COACH         | Only assigned clients (coachId)                  |
| CLIENT        | Mobile app only, own data                        |
