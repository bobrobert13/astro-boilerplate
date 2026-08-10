# Instrucciones del boilerplate

Esta base usa Astro SSR sobre Node, islas Vue, Tailwind CSS, servicios
funcionales y Vitest/MSW. El catálogo de recursos es una demostración
reemplazable, no un dominio obligatorio.

## Arquitectura

- `src/config/index.config.ts` es la fachada pública de rutas, marca, límites,
  cache, storage keys y defaults.
- Las páginas/componentes consumen datos mediante `src/services/`; nunca
  importan fixtures desde `src/data/`.
- Los servicios son factorías de funciones, independientes del ciclo de vida
  Vue. No se usan clases, Repository pattern ni estado global mutable.
- Las operaciones externas devuelven `ServiceResult<T>` y normalizan errores a
  `ServiceError`.
- Resolver tokens y usuarios por operación/request; nunca capturarlos en el
  scope de un módulo ni mutar defaults globales Axios durante SSR.
- La lógica de negocio vive en servicios o funciones puras; los handlers
  Astro solo validan entrada, delegan y traducen la respuesta HTTP.
- Astro renderiza en servidor por defecto. `prerender = true` se reserva para
  rutas intencionalmente estáticas como `/404`.

## Catálogo y API

El contrato de demostración expone recursos paginados mediante fixture o API:

- `GET /api/catalog/resources`
- `GET /api/catalog/resources/:slug`
- `GET /api/catalog/categories`

La fuente por defecto es `fixture`. El selector `PUBLIC_DATA_SOURCE=api` debe
seguir funcionando localmente contra los endpoints Astro. Los errores esperados
usan `{ error: { code, message } }`; no se inventan campos DTO ni datos de
fallback.

## Autenticación

`AUTH_PROVIDER=none` es el default y permite arrancar sin secretos. En ese
modo las rutas de auth/cuenta se ocultan y devuelven 404. `AUTH_PROVIDER=clerk`
activa la integración Clerk cuando existen `PUBLIC_CLERK_PUBLISHABLE_KEY` y
`CLERK_SECRET_KEY`.

El middleware solo popula el contexto Clerk. Cada página o endpoint protegido
debe comprobar su propia autorización mediante la boundary de auth; no confiar
en un matcher global de rutas. Nunca usar claves de producción en tests.

## Testing

- `*.test.ts`: Node para funciones, configuración, servicios, HTTP y endpoints.
- `*.dom.test.ts`: happy-dom para composables Vue, storage, URL y componentes.
- Las pruebas HTTP usan requests Axios reales interceptadas por MSW; no se
  mockea Axios ni se realizan requests a Internet.
- MSW debe fallar requests no declarados. Los contratos fixture/HTTP son
  compartidos.
- Escribir escenarios de éxito y fallo esperado antes o junto a la conducta.
- Limpiar timers, storage, listeners, mocks y wrappers en cada caso.
- No introducir Playwright, E2E de navegador o CI alternativo sin aprobación.

## Validación y desarrollo

Para el servidor local usar únicamente:

```bash
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

Antes del handoff ejecutar:

```bash
npm run format:check
npm run lint
npm run check
npm run test:coverage
npm run build
npm audit --audit-level=high
```

## Cambios y documentación

- Código nuevo sin `any`, `@ts-ignore` ni secretos; preferir guard clauses y
  constantes centralizadas.
- Los archivos TypeScript nuevos documentan su propósito con JSDoc.
- Tests y documentación viajan con la conducta que verifican.
- Los commits son Conventional Commits, con objetivo aproximado de 250–400
  líneas propias y máximo 1.200. Lockfiles y skills vendorizadas se reportan
  aparte.
- Actualizar `docs/architecture.md`, `docs/testing.md` y la guía específica
  cuando cambie un contrato o flujo.
