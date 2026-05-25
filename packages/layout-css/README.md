# @ly-sys/layout-css

## 📋 Propósito (Purpose)

El paquete `@ly-sys/layout-css` es la herramienta de compilación y compilador estático de estilos del ecosistema. Provee
la lógica de generación de utilidades de diseño, el plugin oficial para **PostCSS** y una interfaz de línea de
comandos (**CLI**) que permite compilar hojas de estilo personalizadas con prefijos y breakpoints a medida, sin
sobrecargar el tiempo de ejecución.

---

## 🏗️ Arquitectura (Architecture)

La arquitectura de generación de estilos CSS se basa en una compilación por capas y especificidad limpia.

### 🏛️ Orden y Precedencia de Capas CSS

Para evitar colisiones entre resets de navegador, tokens y utilidades en aplicaciones complejas, el CSS generado se
estructura bajo capas lógicas utilizando `@layer`:

- **`theme`**: Declaración inicial de variables y tokens.
- **`base`**: Resets de navegador globales.
- **`global`**: Variables y tokens base de la librería (bajo prioridad base para facilitar personalizaciones).
- **`layout`**: Clases estructurales principales emitidas por la suite.
- **`components`**: Estilos de componentes propios de tu aplicación.
- **`utilities`**: Clases atómicas rápidas para overrides locales (ej: overrides de Tailwind).

---

## ⚙️ Instalación (Installation)

```bash
pnpm add @ly-sys/layout-css
```

---

## 📖 Guía de Uso (Usage Guide)

### Integración Mediante Plugin PostCSS

Si utilizas bundlers modernos como Vite o Rsbuild, puedes automatizar la generación agregando el plugin en tu archivo
`postcss.config.js` (o equivalente):

```javascript
// postcss.config.js
import {layoutPostcssPlugin} from "@ly-sys/layout-css";

export default {
    plugins: [
        layoutPostcssPlugin({
            prefix: "ly-sys", // Prefijo opcional
            breakpoints: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px"
            }
        })
    ]
};
```

Y luego inyectar la hoja de estilos en tu archivo CSS global:

```css
/* global.css */
@ly-sys-layout;
```

### Compilación Autónoma mediante CLI

Puedes compilar tus archivos de estilos estáticos de forma directa ejecutando la herramienta de línea de comandos en tu
terminal:

```bash
npx ly-layout-css --prefix ly-sys --out src/styles/layout-custom.css
```

---

## 🔍 Detalles Adicionales (Additional Details)

### 🎨 Escala de Tokens de Espaciado (Design Tokens)

Las hojas de estilo inyectan variables nativas de CSS para definir márgenes, paddings y espaciados (gaps). A
continuación se muestra la escala base de tokens por defecto:

| Escala | Token CSS                                 | Valor Base | Equivalente |
|:------:|:------------------------------------------|:----------:|:------------|
| **1**  | `--ly-sys-gap-1` / `--ly-sys-padding-1`   |   `4px`    | `0.25rem`   |
| **2**  | `--ly-sys-gap-2` / `--ly-sys-padding-2`   |   `8px`    | `0.5rem`    |
| **3**  | `--ly-sys-gap-3` / `--ly-sys-padding-3`   |   `12px`   | `0.75rem`   |
| **4**  | `--ly-sys-gap-4` / `--ly-sys-padding-4`   |   `16px`   | `1rem`      |
| **5**  | `--ly-sys-gap-5` / `--ly-sys-padding-5`   |   `20px`   | `1.25rem`   |
| **6**  | `--ly-sys-gap-6` / `--ly-sys-padding-6`   |   `24px`   | `1.5rem`    |
| **7**  | `--ly-sys-gap-7` / `--ly-sys-padding-7`   |   `28px`   | `1.75rem`   |
| **8**  | `--ly-sys-gap-8` / `--ly-sys-padding-8`   |   `32px`   | `2rem`      |
| **9**  | `--ly-sys-gap-9` / `--ly-sys-padding-9`   |   `36px`   | `2.25rem`   |
| **10** | `--ly-sys-gap-10` / `--ly-sys-padding-10` |   `40px`   | `2.5rem`    |
| **11** | `--ly-sys-gap-11` / `--ly-sys-padding-11` |   `44px`   | `2.75rem`   |
| **12** | `--ly-sys-gap-12` / `--ly-sys-padding-12` |   `48px`   | `3rem`      |

### Anchos Máximos (`Container`)

- **Ancho máximo por pantalla**: `--ly-sys-max-w-xs` (`320px`) a `--ly-sys-max-w-7xl` (`1280px`).
- **Valores estructurales**: `--ly-sys-max-w-full` (`100%`), `--ly-sys-max-w-min` (`min-content`),
  `--ly-sys-max-w-max` (`max-content`) y `--ly-sys-max-w-fit` (`fit-content`).
