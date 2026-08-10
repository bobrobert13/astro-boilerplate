# Mantenimiento de dependencias

## Política

- Node mayor fijado en `.nvmrc` y engines.
- npm fijado mediante `packageManager`.
- Dependabot agrupa Astro/Vue, auth, calidad, estilos y GitHub Actions.
- CI ejecuta formato, lint, typecheck, cobertura, build y auditoría alta.
- `overrides` solo se usan para vulnerabilidades o incompatibilidades reproducibles y deben explicarse en el commit.

## Actualización mensual

```bash
npm outdated
npm update
npm run deps:audit
npm run format:check
npm run lint
npm run check
npm run test:coverage
npm run build
```

Revisa changelogs de Astro, adapters, Vue, Clerk y Vitest cuando cambien majors. Si el diff supera 400 líneas de código authored, divide la actualización en unidades revisables; el lockfile generado puede acompañar la unidad que cambia las dependencias.
