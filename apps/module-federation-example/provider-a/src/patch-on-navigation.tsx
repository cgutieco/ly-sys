import "./global.css";

import { BasicChildContainer } from "@computerwwwizards/dependency-injection";
import type { PatchRoutesOnNavigationFunctionArgs } from "react-router";
import { MetricsWidget } from "./components/MetricsWidget";

export default async function patchOnNavigation(
  { patch }: PatchRoutesOnNavigationFunctionArgs,
  { ctx }: { ctx: any },
) {
  console.log("provider-a: patchOnNavigation executing...");

  // Crear un contenedor hijo de DI para el remoto para heredar del Host
  const remoteContainer = new BasicChildContainer(ctx);

  // 1. Registrar 'metrics-provider' para proveer datos a las Cards del Host
  if (ctx && !ctx.get("metrics-provider", true)) {
    ctx.bindTo(
      "metrics-provider",
      () => ({
        async getCardData() {
          return {
            title: "Conversión de Operaciones",
            value: "94.6%",
            percentage: 5.4,
          };
        },
      }),
      "singleton",
    );
  }

  // 2. Registrar CSS diferido no crítico en el layout-service
  if (ctx?.get("layout-service", true)) {
    const layoutService = ctx.get("layout-service");
    layoutService.registerCandidates(
      {
        candidates: [],
        rawCSS: {
          deferable: `
          /* CSS diferido de la cabecera del widget del remoto */
          .providera-highlight-line {
            position: relative;
          }
          .providera-highlight-line::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 40px;
            height: 2px;
            background: var(--ly-color-primary-base);
            box-shadow: 0 0 8px var(--ly-color-primary-base);
          }
        `,
        },
      },
      "provider-a-general",
    );
    layoutService.requestDeferredCSS("provider-a-general");
  }

  // 3. Inyectar/Parchear las sub-rutas dinámicamente en el router
  patch(null, [
    {
      path: "/operations-metrics",
      element: <MetricsWidget ctx={remoteContainer as any} />,
    },
  ]);
}
