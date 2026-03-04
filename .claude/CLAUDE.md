# nexio-app — Frontend de Nexio

## Estructura
- apps/web → Dashboard coach (Next.js 14)
- apps/mobile → App cliente (Expo)
- packages/types → Interfaces TypeScript compartidas
- packages/validations → Schemas Zod compartidos
- packages/api-client → Cliente HTTP tipado
- packages/constants → Enums, tokens

## Comandos
- pnpm dev → Web en port 3000
- pnpm dev --filter @nexio/mobile → Expo

## Backend externo
URL: http://localhost:3001/api
Auth: Bearer {jwt}. NUNCA hardcodear URL, usar NEXT_PUBLIC_API_URL.

## Design tokens
Primary: #0B2E8A, Success: #1E7F4F, Danger: #C62828
Spacing 8pt grid, Radius 8px inputs / 12-16px cards
Lucide para iconos (no emojis), UI en español
Skeleton loaders (no spinners), empty states con CTA

## Convenciones
- Componentes de features en components/features/
- Hooks custom en hooks/
- API client centralizado en lib/api.ts
- Validaciones con Zod via @nexio/validations
- Tipos compartidos via @nexio/types
- Rutas del API en @nexio/constants
