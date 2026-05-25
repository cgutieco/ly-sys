import { LayoutProvider } from "@ly-sys/layout";
import { getInstance } from "@module-federation/enhanced/runtime";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Dashboard } from "./components/Dashboard";

export const App = ({ ctx }: { ctx: any }) => {
  const layoutService = ctx.get("layout-service");

  const router = useMemo(() => {
    return createBrowserRouter(
      [
        {
          path: "/",
          element: <Dashboard ctx={ctx} />,
          children: [],
        },
      ],
      {
        async patchRoutesOnNavigation(args) {
          console.log("React Router 7: patchRoutesOnNavigation", args.path);
          if (args.path.startsWith("/operations-metrics")) {
            try {
              const mf = getInstance();
              if (!mf) {
                console.error("Module Federation runtime instance not found");
                return;
              }
              // Cargar dinámicamente patchOnNavigation de providerA
              const patchModule = (await mf.loadRemote("providerA/patchOnNavigation")) as any;
              const patchFn = patchModule.default || patchModule;

              if (typeof patchFn === "function") {
                await patchFn(args, { ctx });
              }
            } catch (err) {
              console.error("Error loading remote routing patch:", err);
            }
          }
        },
      },
    );
  }, [ctx]);

  return (
    <LayoutProvider engine={layoutService.engine}>
      <RouterProvider router={router} />
    </LayoutProvider>
  );
};
