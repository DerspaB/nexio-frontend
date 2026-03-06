Crea el stack completo para una nueva feature "$ARGUMENTS" en el frontend.

## Pasos en orden:

1. Lee README.md y .claude/CLAUDE.md para contexto
2. Pregunta al usuario qué endpoints del backend cubre esta feature (o lee del backend si tienes acceso)

### Packages (en este orden):

3. **Types** — `packages/types/src/$ARGUMENTS.ts`
   - Interfaces para requests y responses
   - Re-export en `packages/types/src/index.ts`

4. **Constants** — Agregar rutas en `API_ROUTES` de `packages/constants/src/index.ts`
   - Agregar enums si aplica

5. **Validations** — `packages/validations/src/$ARGUMENTS.ts`
   - Schemas Zod para cada input/form
   - Re-export en `packages/validations/src/index.ts`

6. **API Client** — `packages/api-client/src/$ARGUMENTS.ts`
   - Funciones tipadas que usan ApiClient y API_ROUTES
   - Factory function `create{Feature}Api(client)`
   - Re-export en `packages/api-client/src/index.ts`

### Web app:

7. **lib/api.ts** — Instanciar y exportar el nuevo API
8. **Hook** — `apps/web/src/hooks/use-$ARGUMENTS.ts` con SWR
9. **Components** — `apps/web/src/components/features/$ARGUMENTS/`
10. **Page** — `apps/web/src/app/(dashboard)/$ARGUMENTS/page.tsx`

## Reglas:

- Seguir patrones exactos de features existentes (clients, plans, messages)
- UI en español, código en inglés
- Skeleton loaders, empty states con CTA, Lucide icons
- Inline styles, 'use client' donde aplique
