Crea una nueva página del dashboard para la feature "$ARGUMENTS".

## Pasos obligatorios:

1. Lee el README.md y .claude/CLAUDE.md para contexto del proyecto
2. Verifica si ya existen tipos, validaciones o API client para esta feature
3. Si no existen, créalos siguiendo el patrón:
   - `packages/types/src/$ARGUMENTS.ts` — interfaces (re-export en index.ts)
   - `packages/validations/src/$ARGUMENTS.ts` — schemas Zod (re-export en index.ts)
   - `packages/api-client/src/$ARGUMENTS.ts` — funciones API (re-export en index.ts)
   - Agregar rutas en `API_ROUTES` de `packages/constants/src/index.ts`
4. Instancia del API en `apps/web/src/lib/api.ts`
5. Hook SWR en `apps/web/src/hooks/use-$ARGUMENTS.ts`
6. Componentes en `apps/web/src/components/features/$ARGUMENTS/`
7. Página en `apps/web/src/app/(dashboard)/$ARGUMENTS/page.tsx`

## Reglas:

- 'use client' en componentes con estado
- UI en español, código/comentarios en inglés
- Skeleton loaders para loading (no spinners)
- Empty state con CTA cuando no hay datos
- Lucide React para iconos
- Inline styles (consistente con el resto del proyecto)
- SWR para data fetching
- Validar inputs con Zod antes de enviar al API
