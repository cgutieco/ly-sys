# @ly-sys/layout-engine

## 📋 Propósito (Purpose)

`@ly-sys/layout-engine` es el núcleo de computación y resolución del sistema de diseño. Es el motor responsable de
interpretar valores responsivos de diseño (como `gap={{ base: 2, md: 4 }}`), asociar las propiedades a sus respectivas
clases de utilidad e inyectar modificadores de prefijo y breakpoints de forma rápida y eficiente en tiempo de ejecución.

---

## 🏗️ Architecture

El motor de diseño consta de cuatro componentes clave:

1. **Parser Responsivo (`parseResponsive`)**: Traduce declaraciones complejas en un string formateado de clases CSS.
2. **Mapa de Propiedades (`PROPERTY_MAP`)**: Traduce props atómicas de TypeScript (como `alignItems`, `flexDirection`,
   etc.) a clases de utilidad válidas del sistema CSS.
3. **Compilador de Prefijos y Breakpoints**: Prepara y normaliza los nombres de clase según la configuración de
   prefijos (ej: `ly-sys-`) y pantallas asociadas.
4. **Caché LRU (`createLRUCache`)**: Almacena en memoria las traducciones previas de propiedades responsivas para evitar
   la penalización de parsear strings en renders sucesivos.

---

## ⚙️ Instalación (Installation)

```bash
pnpm add @ly-sys/layout-engine
```

---

## 📖 Guía de Uso (Usage Guide)

### Creación del Motor y Parseo de Propiedades

```typescript
import {createLayoutEngine} from "@ly-sys/layout-engine";

// 1. Instanciar el motor con prefijos y breakpoints
const engine = createLayoutEngine({
    libPrefix: "ly-sys",
    breakpoints: ["base", "sm", "md", "lg", "xl"]
});

// 2. Parsear propiedades responsivas
const classes = engine.parseResponsive(
    {base: "row", md: "column"}, // Valor responsivo
    "flexDirection",               // Propiedad de diseño
    (val) => `flex-${val}`         // Función generadora de utilidad
);

console.log(classes);
// Output: "ly-sys-flex-row md:ly-sys-flex-column"
```

---

## 🔍 Detalles Adicionales (Additional Details)

### Rendimiento mediante Caché LRU

Para optimizar las aplicaciones React de alta interactividad, el motor integra un Caché LRU (Least Recently Used) que
almacena un máximo de 500 resoluciones por defecto. Esto asegura que la conversión de objetos responsivos a strings de
clases se realice en tiempo $O(1)$ en la gran mayoría de renders:

```typescript
import {createLRUCache} from "@ly-sys/layout-engine";

const cache = createLRUCache<string, string>(100); // Límite de 100 entradas

cache.set("key-1", "resolved-class-string");
console.log(cache.get("key-1")); // "resolved-class-string"
```
