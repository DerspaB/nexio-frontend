Sincroniza los tipos del frontend con los endpoints del backend.

## Pasos:

1. Lee `packages/constants/src/index.ts` para ver todas las rutas en API_ROUTES
2. Para cada grupo de rutas, verifica que existen:
   - **Types**: Interface en `packages/types/src/{module}.ts` para cada request/response
   - **Validations**: Schema Zod en `packages/validations/src/{module}.ts` para cada input
   - **API client**: Funciones en `packages/api-client/src/{module}.ts` para cada endpoint
3. Verifica los re-exports en cada `index.ts` de los packages
4. Verifica que `apps/web/src/lib/api.ts` instancia todas las APIs disponibles

## Si el usuario pasa una URL de backend o carpeta:

1. Lee los controllers/DTOs del backend para descubrir endpoints
2. Compara con lo que existe en packages/
3. Crea lo que falte siguiendo las convenciones existentes

## Reglas:

- Los tipos deben hacer mirror exacto de los DTOs del backend
- Los schemas Zod deben validar lo mismo que el backend
- Funciones del API client deben usar API_ROUTES de @nexio/constants
- No inventar campos que no existan en el backend
