# Personalización

## Identidad visual

Edita `APP_CONFIG` en `src/config/boilerplate.config.ts` y los tokens en `src/styles/boilerplate.css`. `StarterLayout` concentra el nombre, metadata, navegación y footer; las páginas no deben duplicar ese chrome.

## Datos

Reemplaza los archivos de `src/data/resources/` por fixtures de tu dominio manteniendo el modelo o cambia el modelo y su contrato en un commit propio. Para una API externa:

1. conserva `ResourceService` como contrato público;
2. añade el endpoint y mapper DTO;
3. configura `PUBLIC_API_BASE_URL` y `PUBLIC_DATA_SOURCE=api`;
4. prueba fixture y HTTP con la misma suite de comportamiento.

## Rutas

Actualiza `APP_ROUTES` y crea páginas bajo `src/pages`. Astro es SSR por defecto; declara `prerender = true` solo cuando la ruta sea realmente estática. Las rutas de API deben validar query, serializar errores seguros y devolver headers de caché explícitos.

## Dependencias

`.nvmrc`, `packageManager`, `package-lock.json`, Dependabot y `npm run deps:audit` forman una única política. Actualiza dependencias con `npm install`, revisa el lockfile y ejecuta las validaciones. No edites versiones transitorias salvo que exista un override documentado.
