import { LayoutProvider } from "@ly-sys/layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import { MetricsWidget } from "./components/MetricsWidget";

export const App = ({ ctx }: { ctx: any }) => {
  const layoutService = ctx.get("layout-service");

  const router = createBrowserRouter([
    {
      path: "*",
      element: (
        <div className="providera:min-h-screen providera:bg-slate-950 providera:text-slate-100 providera:p-6">
          <div className="providera:max-w-6xl providera:mx-auto">
            <MetricsWidget ctx={ctx} />
          </div>
        </div>
      ),
    },
  ]);

  return (
    <LayoutProvider engine={layoutService.engine}>
      <RouterProvider router={router} />
    </LayoutProvider>
  );
};
