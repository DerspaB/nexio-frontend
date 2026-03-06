# Auditoria de Limpieza — Nexio Frontend

Fecha: Marzo 2026

---

## 1. CRITICO — Vulnerabilidades de dependencias

**15 vulnerabilidades encontradas** en `pnpm audit`:
- 1 critica (Authorization Bypass en Next.js Middleware)
- 8 altas (DoS en Server Components, HTTP deserialization, etc.)
- 4 moderadas
- 2 bajas

**Fix:** Actualizar Next.js de `14.2.21` a `14.2.25`+ (o migrar a 15.x)

```bash
pnpm --filter @nexio/web update next
```

---

## 2. CRITICO — ESLint no esta configurado en web

`pnpm lint` falla en `@nexio/web` porque **no existe archivo de configuracion ESLint** (`.eslintrc.json`). Esto significa que:
- No hay linting automatico
- No se detectan imports no usados
- No se detectan variables sin usar
- No hay reglas de Next.js

**Fix:** Crear `.eslintrc.json` en `apps/web/`:

```json
{
  "extends": ["next/core-web-vitals"]
}
```

---

## 3. ALTO — Catches silenciosos (22 ocurrencias)

Hay **22 catch vacios** con `// silent` que tragan errores sin notificar al usuario. Si una operacion falla, el usuario nunca se entera.

| Archivo | Linea | Contexto |
|---------|-------|----------|
| `PlanEditor.tsx` | 78, 121, 144, 155, 170, 180, 189, 205 | **8 catches silenciosos** — delete/update/reorder operaciones |
| `ClientPlanTab.tsx` | 35, 50, 68 | Assign/remove plan, fetch exercises |
| `ClientCheckInsTab.tsx` | 41 | Crear check-in |
| `dashboard/page.tsx` | 56 | Fetch KPIs del dashboard |
| `plans/page.tsx` | 70, 80 | Delete/duplicate plan |
| `messages/page.tsx` | 17 | Parse user from localStorage |
| `use-chat.ts` | 76 | Mark as read |
| `forgot-password/page.tsx` | 23 | OK - intencionalmente silencioso por seguridad |

**Fix:** Agregar feedback al usuario (toast/snackbar o state de error) en cada catch, excepto los que son intencionales (forgot-password, localStorage parse).

---

## 4. ALTO — Validacion inconsistente en forms

Solo **4 de ~8 formularios** usan Zod para validar antes de enviar:

| Form | Usa Zod? | Archivo |
|------|----------|---------|
| Login | Si | `login/page.tsx` |
| Register | Si | `register/page.tsx` |
| Create Client | Si | `CreateClientModal.tsx` |
| Create Plan | Si | `CreatePlanModal.tsx` |
| Forgot Password | No | `forgot-password/page.tsx` |
| Reset Password | No (validacion inline) | `reset-password/page.tsx` |
| Update Client (General tab) | No | `ClientGeneralTab.tsx` |
| Assign Plan | No | `ClientPlanTab.tsx` |

**Fix:** Usar `@nexio/validations` en todos los forms que envian datos al API.

---

## 5. MEDIO — localStorage sin centralizar

El acceso a `localStorage` esta disperso en **7 archivos** diferentes, repitiendo `localStorage.getItem('token')` y `localStorage.getItem('user')` + `JSON.parse()`:

- `login/page.tsx` — setItem
- `register/page.tsx` — setItem
- `layout.tsx` — getItem + removeItem
- `dashboard/page.tsx` — getItem
- `messages/page.tsx` — getItem
- `use-socket.ts` — getItem
- `use-chat.ts` — getItem

**Fix:** Crear un modulo `lib/auth.ts` con funciones centralizadas:
```ts
export function getToken(): string | null
export function getUser(): UserPayload | null
export function setAuth(token: string, user: UserPayload): void
export function clearAuth(): void
```

---

## 6. MEDIO — Secciones "Proximamente" sin funcionalidad

Hay **3 placeholders** que no hacen nada:

| Ubicacion | Contenido |
|-----------|-----------|
| `settings/page.tsx` | Pagina entera es placeholder |
| `dashboard/page.tsx:280` | Seccion "Actividad reciente" — placeholder |
| `mobile/app/(tabs)/index.tsx` | App movil entera es placeholder |

**Fix:** Decidir si se eliminan de la navegacion hasta que esten listos, o implementarlos. La pagina de settings no deberia estar visible en el sidebar si no funciona.

---

## 7. MEDIO — Mobile app es solo scaffold

`apps/mobile/` tiene un **unico archivo** (`app/(tabs)/index.tsx`) que solo dice "Proximamente". Todo el scaffolding de Expo esta ahi pero no se usa.

**Opciones:**
- Eliminarlo si no se va a trabajar pronto (reduce ruido en el monorepo)
- Dejarlo si esta en roadmap cercano

---

## 8. BAJO — Lint no configurado en mobile

`apps/mobile` tiene `echo 'No lint configured yet'` como script de lint. Si se va a mantener, configurar ESLint.

---

## 9. BAJO — API_URL duplicada

La URL base del API se define como fallback en **2 archivos**:
- `lib/api.ts:15` — `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'`
- `hooks/use-socket.ts:6` — Mismo patron

**Fix:** Exportar la URL desde `lib/api.ts` y reutilizarla:
```ts
// lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

---

## 10. MEDIO — Estilos inline duplicados masivamente

Todos los componentes usan inline styles con CSS variables (consistente), pero hay **duplicacion masiva** de estilos identicos entre archivos:

- **Error box**: Mismo bloque de estilos `backgroundColor: '#FEE2E2'` repetido en `login/page.tsx`, `register/page.tsx`, `reset-password/page.tsx`, `forgot-password/page.tsx`
- **Botones primarios**: Mismo `backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-button)'` en cada form
- **Modal overlay**: Mismo `position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)'` en `CreateClientModal`, `CreatePlanModal`, `NewConversationModal`, `AssignPlanModal`, `AddDayModal`
- **Input styles**: Padding, border, borderRadius identicos en cada formulario

**Fix:** Crear componentes primitivos reutilizables (`Button`, `Input`, `Modal`, `ErrorAlert`) o al minimo extraer objetos de estilo compartidos a un archivo `lib/styles.ts`.

---

## 11. BAJO — Skeleton loaders sin componente compartido

Todos usan `animation: 'pulse 1.5s ease-in-out infinite'` correctamente, pero **cada componente reimplementa su propio skeleton** en lugar de tener un `<Skeleton />` reutilizable. Hay ~22 ocurrencias del mismo patron de skeleton.

**Fix:** Crear un componente `<Skeleton width height borderRadius />` reutilizable.

---

## 12. BAJO — Archivos grandes con mucha responsabilidad

| Archivo | Lineas | Nota |
|---------|--------|------|
| `ClientPlanTab.tsx` | 372 | Tab con fetch, assign, remove, lista de ejercicios |
| `reset-password/page.tsx` | 337 | Form + strength indicator + token validation |
| `PlanEditor.tsx` | 334 | Editor complejo con 8 operaciones CRUD |
| `plans/page.tsx` | 322 | Tabla + filtros + delete + duplicate |
| `NewConversationModal.tsx` | 318 | Modal con busqueda + lista + skeleton |

No son criticos, pero `PlanEditor.tsx` con 8 catches silenciosos podria beneficiarse de extraer las operaciones a un hook custom.

---

## 13. BAJO — StatusPill duplicado

Existen dos componentes casi identicos:
- `components/features/clients/ClientStatusPill.tsx` (36 lineas)
- `components/features/plans/PlanStatusPill.tsx` (38 lineas)

Ambos hacen lo mismo: mapean un status a un color y label, y renderizan un badge.

**Fix:** Crear un `StatusPill` generico que reciba config de colores/labels.

---

## Resumen de prioridades

| # | Prioridad | Issue | Esfuerzo |
|---|-----------|-------|----------|
| 1 | CRITICO | Actualizar Next.js (15 vulnerabilidades) | 30 min |
| 2 | CRITICO | Configurar ESLint en web | 15 min |
| 3 | ALTO | Agregar error handling en catches silenciosos (22) | 2-3 hrs |
| 4 | ALTO | Validacion Zod en todos los forms | 1-2 hrs |
| 5 | MEDIO | Centralizar acceso a localStorage | 1 hr |
| 6 | MEDIO | Decidir que hacer con placeholders "Proximamente" | 30 min |
| 7 | MEDIO | Decidir que hacer con mobile scaffold | 15 min |
| 8 | BAJO | Configurar lint en mobile | 15 min |
| 9 | BAJO | Centralizar API_URL | 15 min |
| 10 | MEDIO | Extraer estilos duplicados / crear componentes UI base | 3-4 hrs |
| 11 | BAJO | Componente Skeleton reutilizable | 1 hr |
| 12 | BAJO | Refactorizar archivos grandes | 2-3 hrs |
| 13 | BAJO | Unificar StatusPill duplicado | 30 min |

**Tiempo total estimado: ~12-15 horas**

---

## Lo que esta BIEN (no tocar)

- **SWR hooks**: Todos siguen el mismo patron, misma shape de retorno — excelente
- **API client**: Todo centralizado en `lib/api.ts`, cero fetch/axios directo — perfecto
- **Estructura de componentes**: `components/features/{module}/` consistente — bien organizado
- **Naming**: PascalCase en componentes, kebab-case en hooks — consistente
- **CSS variables**: Todos los colores/spacing usan tokens via CSS vars — correcto
- **.env**: No trackeado en git, usa `.env.example` — correcto
- **Build**: Compila limpio sin warnings de TypeScript
- **Codigo muerto**: Cero imports y cero exports sin usar — todo se utiliza
- **Paquetes npm**: Todas las dependencias de `package.json` se usan (`@dnd-kit`, `swr`, `socket.io-client`, etc.)
