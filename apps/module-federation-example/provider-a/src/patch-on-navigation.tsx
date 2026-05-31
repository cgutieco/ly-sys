import { BasicChildContainer } from "@computerwwwizards/dependency-injection";
import type { PatchRoutesOnNavigationFunctionArgs } from "react-router";
import { MetricsWidget } from "./components/MetricsWidget";
import { PROVIDERA_CRITICAL_CSS, PROVIDERA_DEFERRED_CSS } from "./styles/styles";

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

  // 2. Registrar CSS crítico y diferido en el layout-service
  if (ctx?.get("layout-service", true)) {
    const layoutService = ctx.get("layout-service");
    layoutService.registerCandidates(
      {
        candidates: [],
        rawCSS: {
          critical: PROVIDERA_CRITICAL_CSS,
          deferable: PROVIDERA_DEFERRED_CSS,
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
