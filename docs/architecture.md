# Arquitectura

Este starter usa Astro SSR por defecto, Vue únicamente donde existe interacción de navegador y servicios funcionales como frontera estable entre UI y datos.

## Flujo

```text
Página Astro / isla Vue
          ↓
Servicio ResourceService
       ↙       ↘
 fixture       Axios
       ↘       ↙
     ServiceResult<T>
```

`src/config/index.config.ts` es la fachada pública. Una página nunca importa fixtures directamente: pide datos a `useConfiguredResourceService()`. El selector `PUBLIC_DATA_SOURCE` elige `fixture` o `api` sin cambiar el consumidor.

## Contratos y errores

`ResourceService` expone `list`, `getBySlug` y `getCategories`. Las consultas se normalizan antes de filtrar y paginar; los mappers validan payloads externos. Los fallos esperables usan `ServiceResult<T>` y `ServiceError` con código y status seguro para la interfaz.

Las operaciones Axios reciben `AbortSignal` y resuelven el token por llamada. Nunca se mutan defaults globales de Axios, importante para SSR concurrente.

## Rutas Astro

- `src/pages/*.astro` contiene composición SSR y estados HTTP.
- `src/pages/api/` traduce URL/query a servicios y serializa resultados.
- `src/components/boilerplate/ResourceCatalog.vue` es una isla Vue: cancela solicitudes anteriores, ignora respuestas obsoletas y representa loading/error/empty.
- `src/layouts/StarterLayout.astro` centraliza HTML, navegación y tokens.

## Autenticación opcional

`AUTH_PROVIDER=none` deja el middleware en passthrough y responde 404 en `/account`, `/sign-in` y `/sign-up`. Clerk permanece registrado en build para resolver sus módulos virtuales, pero no procesa rutas ni sesiones. Con `AUTH_PROVIDER=clerk`, el middleware protege `/account`. La guía completa está en [`docs/authentication.md`](./authentication.md).

## Extender el dominio

1. Define el modelo y el contrato en `src/services/<context>/`.
2. Añade fixture y servicio fixture determinista.
3. Añade mapper, endpoints y servicio HTTP con el mismo contrato.
4. Expón un endpoint Astro fino si el navegador necesita una fachada local.
5. Consume el servicio desde una página o isla; no importes datos directamente.
6. Escribe pruebas de contrato antes o junto con cada adaptador.

No se prescribe Repository pattern ni clases: las factorías pequeñas hacen explícitas sus dependencias y son fáciles de sustituir en tests.
