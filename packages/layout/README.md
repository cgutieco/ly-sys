# @ly-sys/layout

## 📋 Propósito (Purpose)

El paquete `@ly-sys/layout` es el punto de entrada (facade) unificado y la distribución de producción de la suite
completa de diseño. Re-exporta las herramientas del motor, componentes primitivos, protocolos de comunicación y
componentes de React bajo un único paquete para simplificar la integración del desarrollador. También expone las hojas
de estilo CSS pre-compiladas.

---

## 🏗️ Arquitectura (Architecture)

Este paquete actúa como una fachada monolítica limpia sobre los sub-paquetes modulares del monorepo:

- `@ly-sys/layout-engine` (Core de parseo y caché)
- `@ly-sys/layout-primitives` (Componentes atómicos: Flex, Grid, HStack, etc.)
- `@ly-sys/layout-protocol` (Contratos de candidatos MFE)
- `@ly-sys/layout-react` (Contexto de React y hooks)

Al importar de `@ly-sys/layout`, el compilador y bundler resuelven las dependencias internas optimizando el árbol de
importaciones (*tree-shaking*).

---

## ⚙️ Instalación (Installation)

```bash
pnpm add @ly-sys/layout
```

---

## 📖 Guía de Uso (Usage Guide)

### Importación Unificada en Aplicaciones React

```tsx
import {
    Flex,
    Grid,
    GridItem,
    HStack,
    LayoutProvider,
    createCandidateCollector,
    createLayoutEngine,
    useLayout,
} from "@ly-sys/layout";
import React from "react";

// Importar los estilos por defecto directamente desde la librería
import "@ly-sys/layout/styles.css";

const engine = createLayoutEngine({libPrefix: "ly-sys"});
const collector = createCandidateCollector();

export function App() {
    return (
        <LayoutProvider engine={engine} collector={collector}>
            <HStack gap={4} p={4} justify="space-between">
                <h2>Panel de Control</h2>
                <Flex gap={2}>
                    <button type="button">Guardar</button>
                    <button type="button">Cancelar</button>
                </Flex>
            </HStack>
        </LayoutProvider>
    );
}
```

---

## 🔍 Detalles Adicionales (Additional Details)

### Coexistencia Recomendada con Tailwind CSS v4

Para que la librería coexista limpiamente con Tailwind v4 sin que Preflight anule los estilos estructurales de la
librería ni que ésta colisione con las clases de Tailwind, define la importación estructurada de capas CSS en tu archivo
global CSS (`index.css`):

```css
/* src/index.css */
@layer theme, base, global, layout, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);

/* Inyecta las variables globales y clases del layout dentro de la capa 'layout' */
@import "@ly-sys/layout/styles.css";

@import "tailwindcss/utilities.css" layer(utilities);
```

#### Beneficios de esta configuración:

1. **Prioridad Determinista**: La capa `layout` de `@ly-sys/layout` se declara después de `base` de Tailwind, asegurando
   que los márgenes y estructuras del layout no sean reseteados.
2. **Overrides en Línea**: La capa `utilities` de Tailwind se evalúa al final, permitiendo usar utilidades como
   `hidden`, `md:block` o `p-2` de Tailwind para modificar en línea y con total control el comportamiento de los
   componentes estructurales (ej: `<HStack className="hidden md:flex">`).
