import "./global.css";

import { BasicContainer } from "@computerwwwizards/dependency-injection";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  type InheritedServices,
  mockHostServicesPlugin,
  type RemoteServices,
} from "./services/mock-plugins";

// Inicializar contenedor DI standalone
const container = new BasicContainer<RemoteServices & InheritedServices>();

// Cargar plugins de mocks de servicios del Host y de Layout
container.use(mockHostServicesPlugin as any);

// Registrar metrics-provider local para el widget en standalone
container.bindTo(
  "metrics-provider",
  () => ({
    async getCardData() {
      return {
        title: "Conversión de Operaciones (Mock Standalone)",
        value: "92.1%",
        percentage: 2.1,
      };
    },
  }),
  "singleton",
);

// Montar la aplicación React
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App ctx={container as any} />
    </StrictMode>,
  );
}
