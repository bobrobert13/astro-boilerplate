# Astro Starter

Boilerplate SSR para construir aplicaciones Astro de alcance medio o alto con una arquitectura reemplazable, servicios tipados y una demo funcional de catálogo. El proyecto está deliberadamente neutral: cambia los recursos de ejemplo, los tokens y la fuente de datos sin arrastrar un dominio de negocio.

## Requisitos e inicio

- Node.js `22.12+` (versión fijada en `.nvmrc`).
- npm `10.9+`.

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:4321`.

Para el flujo de agentes, inicia Astro en background:

```bash
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Scripts

| Script                  | Propósito                        |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Desarrollo local.                |
| `npm run build`         | Build SSR Node standalone.       |
| `npm run preview`       | Ejecutar el build local.         |
| `npm run check`         | Astro, TypeScript y tipos Vue.   |
| `npm run lint`          | ESLint.                          |
| `npm run test`          | Suite Vitest unit + DOM.         |
| `npm run test:coverage` | Suite con cobertura y umbrales.  |
| `npm run format:check`  | Verificación Prettier.           |
| `npm run deps:audit`    | Auditoría npm de severidad alta. |

## Variables de entorno

```dotenv
PUBLIC_DATA_SOURCE=fixture
PUBLIC_API_BASE_URL=/api
PUBLIC_API_TIMEOUT_MS=10000
AUTH_PROVIDER=none
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace-me
CLERK_SECRET_KEY=sk_test_replace-me
```

`fixture` es la fuente predeterminada y permite ejecutar la demo sin backend. Usa `api` cuando exista un backend que implemente el contrato documentado. La autenticación permanece apagada hasta seleccionar `AUTH_PROVIDER=clerk` y proporcionar sus claves.

## Rutas de demostración

| Ruta                               | Responsabilidad                                                |
| ---------------------------------- | -------------------------------------------------------------- |
| `/`                                | Presentación y recursos destacados.                            |
| `/catalog`                         | Catálogo SSR con isla Vue, búsqueda, filtros y paginación.     |
| `/resources/[slug]`                | Detalle SSR de un recurso.                                     |
| `/api/catalog/resources`           | Lista paginada y filtrable.                                    |
| `/api/catalog/resources/[slug]`    | Recurso individual.                                            |
| `/api/catalog/categories`          | Categorías disponibles.                                        |
| `/account`, `/sign-in`, `/sign-up` | Rutas Clerk opcionales; responden 404 cuando está desactivado. |

## Estructura

```text
src/
├─ components/boilerplate/  UI reutilizable e isla Vue del catálogo
├─ config/                  fachada de constantes y defaults
├─ data/resources/          fixtures tipados reemplazables
├─ layouts/                 StarterLayout SSR
├─ pages/                   páginas y endpoints Astro
├─ services/resources/      contrato, fixture, HTTP, query y mappers
├─ services/shared/         Axios, Result y errores normalizados
├─ services/auth/           resolución del proveedor opcional
└─ styles/boilerplate.css   tokens y estilos neutrales
```

La arquitectura, el contrato HTTP, autenticación, testing y personalización están descritos en [`docs/`](./docs/). El plan de extracción con estimaciones y criterios de aceptación está en [`docs/plans/2026-08-10-astro-boilerplate.md`](./docs/plans/2026-08-10-astro-boilerplate.md).

## Calidad

Antes de entregar cambios ejecuta:

```bash
npm run format:check
npm run lint
npm run check
npm run test
npm run test:coverage
npm run build
npm run deps:audit
```

GitHub Actions ejecuta el mismo conjunto en cada push y pull request. Dependabot agrupa actualizaciones por ecosistema para facilitar revisiones periódicas.

## Licencia

MIT. Consulta [`LICENSE`](./LICENSE).
