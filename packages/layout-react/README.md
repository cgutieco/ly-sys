# @ly-sys/layout-react

## 📋 Propósito (Purpose)

El paquete `@ly-sys/layout-react` provee los bindings oficiales de React para la suite de diseño. Proporciona el
contexto global (`LayoutContext`), el proveedor (`LayoutProvider`) y los hooks (`useLayout`) necesarios para conectar de
manera segura y transparente los componentes React con el motor de layout y el recolector de candidatos MFE.

---

## 🏗️ Arquitectura (Architecture)

La arquitectura de este paquete gira en torno a la **decoración del motor** durante el tiempo de renderizado:

- **`LayoutProvider`**: Recibe una instancia de `LayoutEngine` y, de forma opcional, un `CandidateCollector`. Si el
  colector está presente, el proveedor decora el motor interceptando su método `parseResponsive`. Cada vez que un
  componente de layout calcula una clase responsiva, el proveedor la registra inmediatamente en el colector.
- **Seguridad en SSR**: La instanciación por petición del `CandidateCollector` a nivel de Provider asegura que los
  estilos dinámicos de renderizados concurrentes en el servidor no tengan fugas de memoria o se mezclen entre
  peticiones.

---

## ⚙️ Instalación (Installation)

```bash
pnpm add @ly-sys/layout-react
```

---

## 📖 Guía de Uso (Usage Guide)

### Integración de `LayoutProvider` en tu Aplicación React

```tsx
import {createLayoutEngine} from "@ly-sys/layout-engine";
import {createCandidateCollector} from "@ly-sys/layout-protocol";
import {LayoutProvider} from "@ly-sys/layout-react";
import React from "react";

// 1. Inicializar servicios
const engine = createLayoutEngine({libPrefix: "ly-sys"});
const collector = createCandidateCollector();

export function App() {
    return (
        <LayoutProvider engine={engine} collector={collector}>
            <MainLayout/>
        </LayoutProvider>
    );
}
```

### Consumir el Contexto con `useLayout`

```tsx
import {useLayout} from "@ly-sys/layout-react";
import React from "react";

export function CustomBox({children}: { children: React.ReactNode }) {
    const {engine} = useLayout();

    // Resolver clases dinámicas manualmente usando el motor del contexto
    const classes = engine.parseResponsive(
        {base: 2, md: 4},
        "gap",
        (val) => `gap-${val}`
    );

    return <div className={classes}>{children}</div>;
}
```

---

## 🔍 Detalles Adicionales (Additional Details)

### Ciclo de Vida y Aislamiento en SSR (Server-Side Rendering)

Cuando uses este paquete en un servidor node.js / SSR:

1. Crea un `collector` único **por cada solicitud entrante**.
2. Envuelve tu renderizado con un `<LayoutProvider engine={engine} collector={collector}>` específico de ese request.
3. Tras finalizar el HTML string rendering, ejecuta `collector.flush()` para obtener el lote de estilos exacto que usó
   esa página y límpialo para prevenir fugas de memoria.

### ❓ ¿Por qué mi slot de `candidates` suele estar vacío?

Si estás desarrollando en un Micro-Frontend (Remote) utilizando componentes primitivos de React de `@ly-sys/layout` (
como `<Flex>`, `<Grid>`, `<VStack>`), es completamente normal que al llamar imperativamente a
`layoutService.registerCandidates` envíes el array de `candidates` vacío (`candidates: []`).

Esto ocurre gracias a la **recolección automática** de este paquete:

* Al renderizar componentes de layout en React, el `LayoutProvider` intercepta automáticamente las clases responsivas y
  las registra en el colector de candidatos del Host.

#### ¿Cuándo debes poblar `candidates` manualmente?

Debes usar el array `candidates` de forma manual en escenarios donde el recolector automático de React no tiene
visibilidad de las clases utilitarias de layout:

1. **Uso de HTML Nativo**: Si utilizas etiquetas HTML planas (como `<div>` o `<button>`) con clases utilitarias del
   layout directamente (ej: `className="ly-flex ly-gap-4"`), en lugar de los componentes primitivos `<Flex>` o
   `<VStack>`.
2. **Microfrontends no basados en React**: Si integras módulos remotos construidos en **Svelte**, **Angular** o *
   *Vanilla JS** que utilicen el sistema de rejilla y clases de maquetación del Host.
3. **HTML Dinámico**: Si inyectas código dinámico de un API o headless CMS mediante `dangerouslySetInnerHTML` que
   contenga clases utilitarias de maquetación.

