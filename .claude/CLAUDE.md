# nexio-app — Frontend de Nexio

Plataforma de coaching fitness para LATAM. Monorepo con pnpm + Turborepo.

## Estructura

```
apps/web       → Dashboard coach (Next.js 14, App Router, port 3000)
apps/mobile    → App cliente (Expo, scaffold)
packages/types       → Interfaces TypeScript (mirrors backend responses)
packages/validations → Schemas Zod (mirrors backend DTOs)
packages/api-client  → Cliente HTTP tipado (fetch, sin deps externas)
packages/constants   → Enums, design tokens, API route map
```

## Comandos

- `pnpm dev` → Web en port 3000
- `pnpm dev --filter @nexio/mobile` → Expo
- `pnpm build` → Build all
- `pnpm lint` → Lint all

## Backend externo

- URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api`)
- Auth: Bearer JWT. NUNCA hardcodear URL.
- WebSocket: Socket.IO en mismo backend para messaging en tiempo real.

## Módulos del dashboard

| Ruta              | Feature                                          |
|-------------------|--------------------------------------------------|
| `/login`          | Login + link a forgot password                   |
| `/register`       | Registro (crea org + owner)                      |
| `/forgot-password`| Solicitud de reset (siempre muestra éxito)       |
| `/reset-password` | Nueva contraseña con indicador de fuerza + token |
| `/dashboard`      | Home con cards placeholder                       |
| `/clients`        | Tabla, búsqueda, filtro status, paginación, CRUD |
| `/clients/[id]`   | Detalle con tabs: General, Plan, Check-ins       |
| `/plans`          | Tabla de planes, CRUD, duplicar, asignar         |
| `/plans/[id]`     | Editor de plan: días, bloques, ejercicios        |
| `/messages`       | Chat en tiempo real, lista conversaciones, modal nueva conv |
| `/settings`       | Configuración                                    |

## APIs disponibles en lib/api.ts

authApi, usersApi, clientsApi, exercisesApi, plansApi, daysApi, blocksApi, todayApi, checkInsApi, messagingApi

## Hooks (apps/web/src/hooks/)

- `useClients(filters)` / `useClient(id)` → SWR para clientes
- `usePlans()` / `usePlan(id)` → SWR para planes
- `useExerciseSearch(query)` → Búsqueda de ejercicios
- `useConversations()` → Lista de conversaciones
- `useChat(conversationId)` → Mensajes + real-time
- `useSocket()` → Conexión WebSocket con auto-reconnect

## Enums (packages/constants)

- `Role`: OWNER, ADMIN, COACH, CLIENT
- `ClientStatus`: ACTIVE, AT_RISK, TRIAL, INACTIVE
- `PlanStatus`: TEMPLATE, ACTIVE, PAUSED, COMPLETED
- `BlockType`: EXERCISE, SUPERSET, REST, NOTE
- `CheckInStatus`: COMPLETED, PARTIAL, SKIPPED

## Design tokens

- Primary: #0B2E8A, Success: #1E7F4F, Danger: #C62828
- Spacing 8pt grid, Radius 8px inputs / 12px cards / 16px modals
- Lucide para iconos (no emojis), UI en español
- Skeleton loaders (no spinners), empty states con CTA

## Convenciones de código

- Feature components en `components/features/{module}/`
- Hooks custom en `hooks/use-{feature}.ts`
- API client centralizado en `lib/api.ts` (importa de @nexio/api-client)
- Validaciones con Zod via @nexio/validations
- Tipos compartidos via @nexio/types
- Rutas del API en `API_ROUTES` de @nexio/constants
- Inline styles (no CSS modules ni Tailwind en web app)
- `'use client'` en componentes con estado/hooks
- SWR para data fetching con caching y revalidation

## Patrón para nuevas features

1. Tipos en `packages/types/src/{feature}.ts` + re-export en index
2. Schema Zod en `packages/validations/src/{feature}.ts` + re-export en index
3. API functions en `packages/api-client/src/{feature}.ts` + re-export en index
4. Ruta en `API_ROUTES` de `packages/constants`
5. Hook SWR en `apps/web/src/hooks/use-{feature}.ts`
6. Componentes en `apps/web/src/components/features/{feature}/`
7. Página en `apps/web/src/app/(dashboard)/{feature}/page.tsx`
