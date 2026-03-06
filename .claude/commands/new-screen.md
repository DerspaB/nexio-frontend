Crea una nueva pantalla mobile para "$ARGUMENTS" en la app Expo.

## Pasos obligatorios:

1. Lee el README.md y .claude/CLAUDE.md para contexto del proyecto
2. Verifica si ya existen tipos, validaciones o API client para esta feature en packages/
3. Si no existen, créalos (reutilizar los mismos packages que usa web)
4. Crea la pantalla en `apps/mobile/app/(tabs)/$ARGUMENTS.tsx`
5. Si necesita componentes, créalos en `apps/mobile/components/`

## Reglas:

- React Native + Expo conventions
- NativeWind para estilos
- Touch targets mínimo 44x44px
- UI en español, código/comentarios en inglés
- Reutilizar @nexio/types, @nexio/validations, @nexio/api-client, @nexio/constants
- Loading states apropiados para mobile
- Manejo de errores user-friendly
