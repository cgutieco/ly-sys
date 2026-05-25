# @ly-sys/layout

Sistema de primitivas de layout para React con deduplicación de clases, props responsivas y protocolo de candidatos para
micro-frontends.

## Contenido

- [Inicio rápido](#inicio-rápido)
- [Paquetes](#paquetes)
- [Primitivas](#primitivas)
- [Engine](#engine)
- [Integración CSS](#integración-css)
- [Protocolo de candidatos](#protocolo-de-candidatos)
- [API y tipos](#api-y-tipos)
- [Infraestructura](#infraestructura)
- [Documentación de referencia](#documentación-de-referencia)

---

## Inicio rápido

Instalación:

```bash
pnpm add @ly-sys/layout
```

Uso básico:

```tsx
import {createLayoutEngine, LayoutProvider, Flex} from "@ly-sys/layout";

const engine = createLayoutEngine({
    libPrefix: "ly",
    appPrefix: "app",
    breakpoints: ["base", "sm", "md", "lg"] as const,
});

export function App() {
    return (
        <LayoutProvider engine={engine}>
            <Flex direction={{base: "column", md: "row"}} gap={4}>
                <aside>Sidebar</aside>
                <main>Contenido principal</main>
            </Flex>
        </LayoutProvider>
    );
}
```

Importar estilos precompilados:

```css
@layer global, layout, components, utils;
@import "@ly-sys/layout/styles";
```

---

## Paquetes

```
packages/
  layout/                  -> Facade pública (re-exports)
  layout-css/              -> Estilos, PostCSS plugin y generador
  layout-engine/           -> Core: parser, prefixer, resolve, LRU cache
  layout-react/            -> LayoutProvider, useLayout, context
  layout-primitives/       -> Flex, Grid, Container, HStack, VStack, etc.
  layout-protocol/         -> CandidateCollector y tipos del protocolo
```

| Paquete                     | Descripción                               | Deps runtime                                            | Size limit |
|-----------------------------|-------------------------------------------|---------------------------------------------------------|------------|
| `@ly-sys/layout`            | Facade — re-exporta todo                  | Todos los internos                                      | —          |
| `@ly-sys/layout-engine`     | Motor de clases, deduplicación, caché LRU | `@ly-sys/layout-protocol`                               | 3 KB       |
| `@ly-sys/layout-react`      | Provider y hook para React                | `layout-engine`, `layout-protocol`                      | 3 KB       |
| `@ly-sys/layout-primitives` | Componentes de layout                     | `layout-engine`, `layout-react`, `@radix-ui/react-slot` | 5 KB       |
| `@ly-sys/layout-protocol`   | Protocolo de candidatos                   | Ninguna                                                 | —          |

Subpath exports disponibles: `@ly-sys/layout/engine`, `@ly-sys/layout/react`,
`@ly-sys/layout/primitives`, `@ly-sys/layout/protocol`, `@ly-sys/layout/styles`.

---

## Primitivas

Componentes incluidos (8): `Flex`, `Grid`, `GridItem`, `Container`, `HStack`, `VStack`, `Center`, `Spacer`.

Todas las primitivas comparten:

- `gap` (valores responsivos)
- `asChild` para renderizado polimórfico via `@radix-ui/react-slot`
- props HTML nativas del elemento que se renderiza

Resumen de props específicas:

- `Flex`: `direction`, `wrap`, `align`, `justify`, `basis`, `grow`, `shrink`
- `HStack` / `VStack`: las de `Flex` excepto `direction`
- `Grid`: `columns`, `minChildWidth`, `rowGap`, `columnGap`
- `GridItem`: `colSpan`, `rowSpan`, `colStart`, `colEnd`, `rowStart`, `rowEnd`
- `Container`: `maxWidth`, `centerContent`
- `Center`: `inline`
- `Spacer`: sin props propias, emite `flex-1`

Notas importantes:

- `Grid` solo permite `columns` y `minChildWidth` a la vez cuando `validationMode` es `Permissive`. En los demás modos
  lanza un error.
- El breakpoint `base` no genera prefijo (si está incluido en `breakpoints`).

---

## Engine

El engine expone tres operaciones principales:

- `parseResponsive`: convierte valores responsivos en clases prefijadas.
- `resolve`: deduplica clases con prioridad `app > neutral > lib`.
- `prefix`: aplica `libPrefix` a utilidades.

Detalles relevantes del comportamiento:

- Deduplicación en O(n) con mapa estático de colisiones y LRU de 500 entradas.
- Valores inválidos se omiten; en modo dev se reportan por consola.
- `libPrefix` default: `"ly-sys"`. `appPrefix` default: `""`.

Validación y errores:

- `validationMode: Permissive` desactiva la validación por `propRules`.
- `useLayout` fuera de `LayoutProvider` lanza error solo en desarrollo; en producción hace `console.error` y retorna
  un engine vacío.

---

## Integración CSS

Las utilidades y tokens se generan en capas `@layer global` y `@layer layout`. Los tokens disponibles incluyen:

- `--ly-sys-gap-*`, `--ly-sys-padding-*`, `--ly-sys-margin-*` (1 a 12)
- `--ly-sys-max-w-*` (`xs` a `7xl`, `full`, `min`, `max`, `fit`)

Para prefijos o breakpoints personalizados usa el plugin de PostCSS:

- Importa `layoutPostcssPlugin` desde `@ly-sys/layout/postcss`.
- Agrega la directiva `@ly-sys-layout;` en tu CSS.

---

## Protocolo de candidatos

En modo `candidateMode: Collect`, el `LayoutProvider` decora el engine para registrar utilidades usadas y opcionalmente
CSS arbitrario (por ejemplo, `minChildWidth`) mediante `CandidateCollector`. El host puede consolidar candidatos y pedir
CSS crítico/diferido a un servicio centralizado.

El contrato del protocolo está en `@ly-sys/layout-protocol` y expone `CANDIDATE_PROTOCOL_VERSION`.

---

## API y tipos

La referencia completa está en los tipos TypeScript distribuidos por cada paquete. Puntos clave:

- `createLayoutEngine` acepta `EngineConfig` con `breakpoints`, `libPrefix`, `appPrefix`, `propRules` y modos de
  validación/candidatos.
- `LayoutProvider` recibe `engine` y opcionalmente `collector`.
- `useLayout` devuelve `{ engine, collector }`.

---

## Infraestructura

Herramientas principales: pnpm, Turborepo, tsup, TypeScript, Vitest, Testing Library, Biome, size-limit.

Scripts disponibles:

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm lint:fix
pnpm format
pnpm size-limit
```

---

## Documentación de referencia

- [Distributed Provider CSS Management (Medium)](https://medium.com/@pieroramirez810/distributed-provider-css-management-c5452b2b2166)

---

## Licencia

MIT. Ver el archivo `LICENSE`.
