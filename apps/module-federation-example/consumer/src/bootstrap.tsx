import { BasicContainer } from "@computerwwwizards/dependency-injection";
import { getInstance } from "@module-federation/enhanced/runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { layoutServicePlugin } from "./services/layout-service/plugin";
import { type HostServices, hostServicesPlugin } from "./top-level-container";

// Registrar remotos en el runtime de Module Federation
const mf = getInstance();
if (mf) {
  mf.registerRemotes(import.meta.env.remotes);
}

// Crear el contenedor de dependencias del Host
const container = new BasicContainer<HostServices>();

// Cargar plugins
container.use(hostServicesPlugin as any);
container.use(layoutServicePlugin as any);

// Renderizar la aplicación React
const containerElement = document.getElementById("root");
if (containerElement) {
  const root = createRoot(containerElement);
  root.render(
    <StrictMode>
      <App ctx={container as any} />
    </StrictMode>,
  );
}
