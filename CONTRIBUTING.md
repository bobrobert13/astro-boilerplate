# Contribuir

El flujo de contribución conserva la misma frontera que el código de
producción: contratos primero, implementación mínima, refactor con pruebas
verdes y documentación junto a la conducta que explica.

## Flujo rápido

1. Usa Node 22 (`nvm use` o `nvm install`).
2. Ejecuta `npm ci` y copia `.env.example` a `.env`.
3. Mantén `AUTH_PROVIDER=none` para trabajar sin secretos.
4. Itera con un test focalizado y termina con los comandos de validación del
   `AGENTS.md`.
5. Crea commits Conventional Commits de una sola unidad de trabajo.

## Reglas de cambios

- Un servicio nuevo necesita contrato, fixture/HTTP cuando corresponda y
  pruebas de success, ausencia y transporte.
- Las islas Vue usan `*.dom.test.ts`; funciones, endpoints y HTTP usan
  `*.test.ts`.
- MSW debe rechazar requests no declarados. Nunca se usa Internet en tests.
- No agregues clases, stores globales, DTOs dentro de componentes ni tokens en
  scope de módulo.
- Todo cambio de API actualiza `docs/api-contract.md`.

## Commit y revisión

El objetivo es 250–400 líneas propias por commit y un máximo de 1.200. Tests y
documentación pertenecen al commit que validan. Antes de solicitar revisión,
adjunta los comandos ejecutados, el resultado de cobertura y cualquier smoke
manual pendiente.
