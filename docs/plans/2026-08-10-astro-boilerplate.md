# Plan de extracción del boilerplate Astro

| Campo | Valor |
| --- | --- |
| Estado | implementación completa y publicada |
| Rama | `feat/astro-boilerplate` |
| Base | `develop` (`8e01f5b`) |
| Destino posterior | `git@github.com:bobrobert13/astro-boilerplate.git` |
| Idioma | español |
| Licencia prevista | MIT |

## Objetivo

Extraer una base reutilizable para aplicaciones Astro de alcance medio/alto,
con SSR Node, islas Vue, Tailwind, servicios funcionales, contratos de
transporte, fixtures, API Astro local, pruebas Vitest/MSW, autenticación Clerk
opcional y documentación para agentes y mantenedores.

El ejemplo funcional será un catálogo neutral de recursos. Se eliminarán el
branding INK/PXL, el dominio manga, el visor de lectura y la estética
brutalista; las convenciones arquitectónicas y de testing permanecerán.

## Decisiones aprobadas

- La rama se llama `feat/astro-boilerplate` y se crea desde `develop`.
- La demo conserva una experiencia completa: home, catálogo paginado, detalle,
  API local, servicios fixture/HTTP, isla Vue y cuenta protegida opcional.
- `AUTH_PROVIDER=none` es el valor predeterminado. En ese modo las rutas auth
  y cuenta se ocultan y responden 404. `AUTH_PROVIDER=clerk` activa Clerk.
- La interfaz usa tokens neutrales; el texto de ejemplo permanece en español.
- El dominio de ejemplo es un catálogo de recursos (`ResourceSummary`,
  `ResourceDetail`, categorías, búsqueda, orden y paginación).
- El modo HTTP usa endpoints Astro locales bajo `/api/catalog/resources` y
  `/api/catalog/categories`, con el mismo contrato que el fixture service.
- Dependencias: mantener majors actuales; actualizar patch/minor compatibles,
  fijar Node 22, añadir Dependabot y GitHub Actions de calidad.
- Se conservarán solo las skills locales Astro y Clerk relevantes; el retiro
  de skills vendorizadas no cuenta contra el presupuesto de líneas authored.
- La documentación, contribución y licencia serán MIT/en español.
- La publicación futura usará un commit raíz limpio. Antes se conservará el
  `main` remoto actual en `archive/pre-boilerplate-2026-08-10`; no se tocará el
  remoto sin confirmación explícita posterior.

## Contrato de catálogo

```ts
type CatalogSort = 'featured' | 'recent' | 'title-asc' | 'title-desc';

interface ResourceCategory {
  slug: string;
  label: string;
}

interface ResourceSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  tags: readonly string[];
  updatedAt: string;
  featured: boolean;
  popularity: number;
}

interface ResourceDetail extends ResourceSummary {
  description: string;
}

interface CatalogQuery {
  search?: string;
  category?: string;
  sort: CatalogSort;
  page: number;
  pageSize: number;
}

interface PaginatedResult<T> {
  items: readonly T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

Defaults: `featured`, página 1, `pageSize=12`, máximo 48. Search se recorta
a 100 caracteres. Query inválida devuelve `validation`/HTTP 400; slug ausente
devuelve `not_found`/HTTP 404. Las respuestas correctas contienen el payload
directo y los errores `{ error: { code, message } }`.

## Fases de implementación

1. **Fundación y plan:** rama, este documento, `AGENTS.md`, skills relevantes,
   licencia, Node/npm, Dependabot y CI.
2. **Core:** fachada de configuración, variables tipadas, rutas neutrales,
   `ServiceResult`, `ServiceError`, Axios request-scoped y cache policy.
3. **Catálogo y API:** tipos, fixtures, validadores, queries, contrato,
   fixture adapter, endpoints Astro, adaptador HTTP, MSW y contrato compartido.
4. **UI:** layout neutral, tokens CSS, home, catálogo SSR + isla Vue, detalle,
   estados vacío/error/loading y accesibilidad.
5. **Auth:** boundary provider, middleware condicional, `requireAuth`, rutas
   Clerk y cuenta server-only; tests con auth apagado y dependencias inyectadas.
6. **Limpieza:** retirar visor, manga, Brutalism, assets y planes históricos;
   mantener build verde en cada unidad.
7. **Documentación:** README, arquitectura, API, autenticación, testing,
   personalización, actualización de dependencias y contribución.
8. **Revalidación:** CodeGraph, contratos, edge cases, DRY, diff review,
   cobertura, build y smoke runtime.

## Archivos y estimación

| Área | Archivos principales | Cambio estimado |
| --- | --- | ---: |
| Tooling | `package.json`, lock, `astro.config.mjs`, `eslint.config.js`, `vitest.config.ts`, `.env.example`, `.nvmrc` | 450–700 + lock generado |
| Automatización | `.github/workflows/quality.yml`, `.github/dependabot.yml`, `LICENSE`, `CONTRIBUTING.md` | 300–500 |
| Config/core | `src/config/**`, `src/services/shared/**`, `src/env.d.ts`, tests | 700–1.000 |
| Catálogo/API | `src/types/resource.ts`, `src/data/catalog/**`, `src/services/catalog/**`, `src/pages/api/catalog/**`, contratos y mocks | 2.400–3.400 |
| UI | layouts, componentes neutrales, páginas, composable de filtros, estilos y tests DOM | 2.000–2.800 |
| Auth | `src/services/auth/**`, `src/services/account/**`, middleware, páginas y tests | 900–1.300 |
| Retiro de dominio | viewer, manga fixtures/componentes, assets, estilos y planes antiguos | 6.000–7.500 eliminadas |
| Docs | README, `docs/architecture.md`, `docs/testing.md` y guías nuevas | 1.200–1.800 |

Total authored aproximado: 13.000–18.000 líneas; 50–72 horas de ingeniería.
Cada commit apunta a 250–400 líneas propias y nunca supera 1.200. Lockfiles y
skills vendorizadas se reportan aparte.

## Validación y cierre

Cada unidad incluye sus tests y un comando focalizado. Antes del cierre:

```bash
npm run format:check
npm run lint
npm run check
npm run test
npm run test:coverage
npm run build
npm audit --audit-level=high
```

También se ejecutará `astro dev --background` para smoke de home, catálogo,
detalle, 404, API y rutas auth con `AUTH_PROVIDER=none`; el servidor se detiene
con `astro dev stop`.

### Resultado de implementación (2026-08-10)

- Rama: `feat/astro-boilerplate`.
- Commits authored en unidades convencionales revisables, con ningún commit
  superior a 1.200 líneas afectadas.
- Suite: 12 archivos, 43 pruebas verdes; cobertura 89.93% statements, 84.61%
  branches, 85.71% functions y 94.2% lines.
- Build SSR Node y `npm audit --audit-level=high`: verdes, 0 vulnerabilidades.
- Smoke: `/`, `/catalog` y `/api/catalog/resources` 200; `/account` y slug
  inexistente 404 con auth desactivada.
- Diff authored aproximado: 9.044 adiciones y 36.438 eliminaciones; el retiro
  de dominio representa la mayor parte de las líneas eliminadas. Lockfile y
  skills vendorizadas se consideran cambios generados.
- El remoto de boilerplate no fue modificado.

## Publicación ejecutada

Se creó el backup remoto `archive/pre-boilerplate-2026-08-10`, preservando el
`main` previo (`e61eba2571b1e52cb62d9d4de7353e4dea094b39`). Luego se publicó un
commit raíz sin historial previo en `main` mediante `--force-with-lease`; el
identificador final se conserva en el handoff.
