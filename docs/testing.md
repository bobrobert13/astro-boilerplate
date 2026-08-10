# Estrategia de pruebas

Vitest ejecuta dos proyectos: Node para lógica/servicios y happy-dom para Vue y APIs del navegador.

| Archivo | Proyecto | Alcance |
| --- | --- | --- |
| `*.test.ts` | unit | queries, mappers, servicios, contratos y errores. |
| `*.dom.test.ts` | dom | componentes, eventos, watchers y cleanup. |
| `tests/` | infraestructura | setup MSW y harness compartido. |

## Flujo test-first

1. Escribe escenarios observables para éxito, vacío, error y cancelación cuando aplique.
2. Ejecuta el archivo enfocado.
3. Implementa el mínimo que satisface el contrato.
4. Refactoriza con la suite verde.
5. Ejecuta cobertura y validaciones completas antes del commit.

```bash
npx vitest run src/services/resources/resource.queries.test.ts
npm run test:unit
npm run test:dom
npm run test:coverage
```

## HTTP y MSW

El cliente Axios se prueba contra MSW, nunca mockeando Axios. `tests/mocks/server.ts` rechaza solicitudes no declaradas (`onUnhandledRequest: 'error'`). Cada caso debe comprobar método, URL, query, headers, payload inválido, timeout, 401/403, 404, error de red y cancelación según su operación.

Los endpoints de `src/pages/api/` se prueban como adaptadores: construir `Request`, invocar el handler y comprobar status, headers y JSON. La lógica permanece en servicios puros.

## Componentes Vue

Monta el componente real con Vue Test Utils. Consulta roles, labels, texto y atributos de contrato; no afirmes clases o layout salvo que representen un estado funcional. Desmonta wrappers y limpia storage, DOM, handlers y timers en cada caso.

La isla de catálogo cubre render inicial, filtrado y estado vacío. Sus carreras de solicitudes se protegen con `AbortController` y un identificador monotónico; una respuesta obsoleta no puede reemplazar el estado actual.

## Determinismo y cobertura

No uses Internet, delays reales ni estado mutable compartido. Fija tiempo y aleatoriedad cuando afecten el resultado. Espera explícitamente promesas y `nextTick`.

`npm run test:coverage` publica texto, HTML y LCOV en `coverage/`. Los umbrales globales son 85% líneas, 75% ramas, 85% funciones y 80% statements. Si el starter gana un contexto importante, conserva pruebas de contrato compartidas entre fixture y API.
