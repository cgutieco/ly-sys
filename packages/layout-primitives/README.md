# @ly-sys/layout-primitives

## 📋 Propósito (Purpose)

`@ly-sys/layout-primitives` provee un conjunto completo de componentes React atómicos y de alto rendimiento diseñados
específicamente para resolver la estructura y espaciado de interfaces de usuario. Incluye primitivas fundamentales como
`Flex`, `Grid`, `HStack`, `VStack`, `Center`, `Container`, `Spacer` y `GridItem`.

---

## 🏗️ Arquitectura (Architecture)

Las primitivas están optimizadas para la cascada y el renderizado rápido:

- **Conexión al Motor**: Cada componente utiliza de forma interna el hook `useLayout` para parsear sus propiedades de
  espaciado y estructura de forma responsiva mediante el motor central.
- **Polimorfismo con Radix Slot**: A través de la propiedad `asChild` (provista mediante `@radix-ui/react-slot`), puedes
  delegar el pintado del elemento DOM al componente hijo manteniendo las clases y propiedades estructurales del layout.
- **Validación Estricta**: El componente `Grid` valida en tiempo de renderizado que sus propiedades de configuración no
  colisionen (por ejemplo, validar que `columns` y `minChildWidth` sean mutuamente excluyentes).

---

## ⚙️ Instalación (Installation)

```bash
pnpm add @ly-sys/layout-primitives
```

---

## 📖 Guía de Uso (Usage Guide)

### Composición y Uso de Componentes de Layout

```tsx
import {Flex, Grid, GridItem, HStack, VStack} from "@ly-sys/layout-primitives";
import React from "react";

export function Dashboard() {
    return (
        <VStack gap={4} p={4} align="stretch">
            {/* Encabezado HStack */}
            <HStack justify="space-between" gap={{base: 2, md: 4}}>
                <h1>Panel de SaaS</h1>
                <button type="button">Refrescar</button>
            </HStack>

            {/* Grid responsivo de tarjetas */}
            <Grid columns={{base: 1, md: 3}} gap={4}>
                <GridItem colSpan={{base: 1, md: 2}}>
                    <div className="card">Gráfico Principal (Toma 2 columnas en MD)</div>
                </GridItem>
                <GridItem>
                    <div className="card">Métricas Secundarias</div>
                </GridItem>
            </Grid>
        </VStack>
    );
}
```

### Uso de Polimorfismo con `asChild`

```tsx
import {Center} from "@ly-sys/layout-primitives";
import React from "react";

export function Section() {
    return (
        // Se renderizará como un elemento HTML5 <section> nativo
        <Center asChild p={8} minH="200px">
            <section className="custom-banner">
                <h2>Contenido Centrado</h2>
            </section>
        </Center>
    );
}
```

---

## 🔍 Detalles Adicionales (Additional Details)

### Reglas de Exclusividad en `Grid`

El primitivo `Grid` cuenta con una validación incorporada para prevenir configuraciones incorrectas en tiempo de
ejecución:

- **`columns`** y **`minChildWidth`** son **mutuamente excluyentes**. Si intentas proveer ambas propiedades al mismo
  tiempo, el componente arrojará un error de desarrollo explícito explicándote que no es posible utilizar columnas
  estáticas junto con un ancho mínimo adaptable para los hijos.
- Si utilizas `minChildWidth`, el componente inyectará un estilo inline crítico (`rawCSS`) dinámico para definir la
  estructura adaptativa CSS Grid.
