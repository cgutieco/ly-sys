import { Grid, HStack, VStack } from "@ly-sys/layout";
import { getInstance } from "@module-federation/enhanced/runtime";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Footer } from "./Footer";
import { Hero } from "./Hero";

// Card común para el Dashboard
export const DashboardCard = ({ title, value, percentage, changeType }: any) => {
  const isPositive = changeType === "positive";
  return (
    <VStack
      gap={2}
      className="glass rounded-xl border border-slate-800 bg-slate-950/40 relative overflow-hidden ly-p-4"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      <span className="text-xs text-slate-400 font-medium">{title}</span>
      <HStack align="baseline" gap={2}>
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        <span
          className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
        >
          {isPositive ? "+" : ""}
          {percentage}%
        </span>
      </HStack>
    </VStack>
  );
};

// Card que obtiene datos asíncronamente mediante Inyección de Dependencias (DI) desde el remoto
export const DIDashboardCard = ({ ctx }: { ctx: any }) => {
  const [data, setData] = useState<{ title: string; value: string; percentage: number } | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    const loadAndResolve = async () => {
      try {
        const mf = getInstance();
        if (!mf) return;

        // Cargar el parche del remoto para que registre sus servicios
        const patchModule = (await mf.loadRemote("providerA/patchOnNavigation")) as any;
        const patchFn = patchModule.default || patchModule;

        if (typeof patchFn === "function" && active) {
          // Ejecutar patch con noop para registrar servicios en el Host
          await patchFn({ patch: () => {} } as any, { ctx });

          const provider = ctx?.get("metrics-provider", true);
          if (provider && active) {
            const res = await provider.getCardData();
            if (active) {
              setData(res);
            }
          }
        }
      } catch (err) {
        console.error("Error loading remote metrics provider:", err);
      }
    };

    loadAndResolve();

    return () => {
      active = false;
    };
  }, [ctx]);

  if (!data) {
    return (
      <VStack
        gap={2}
        className="glass rounded-xl border border-slate-800/80 bg-slate-950/20 animate-pulse ly-p-4"
      >
        <span className="text-xs text-indigo-400 font-semibold tracking-wider">
          DI Remoto (Cargando...)
        </span>
        <div className="h-4 bg-slate-800/80 rounded w-32"></div>
        <div className="h-8 bg-slate-800/80 rounded w-20"></div>
      </VStack>
    );
  }

  return (
    <VStack
      gap={2}
      className="glass rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-950/20 to-slate-950/30 relative overflow-hidden ly-p-4"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/15 rounded-full blur-xl pointer-events-none"></div>
      <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
        DI Remoto
      </span>
      <span className="text-xs text-slate-400 font-medium">{data.title}</span>
      <HStack align="baseline" gap={2}>
        <span className="text-2xl font-bold text-white tracking-tight">{data.value}</span>
        <span className="text-xs font-semibold text-emerald-400">+{data.percentage}%</span>
      </HStack>
    </VStack>
  );
};

export const Dashboard = ({ ctx }: { ctx: any }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <HStack align="stretch" className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barra Lateral / Sidebar usando VStack */}
      <VStack
        gap={6}
        className="w-72 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur shrink-0 hidden md:flex ly-p-5"
      >
        <HStack align="center" gap={3}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            S
          </div>
          <span className="text-md font-bold tracking-tight text-white">SaaS Operations</span>
        </HStack>

        <VStack gap={2} className="grow">
          <Link
            to="/"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isHome
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            📊 Panel Central
          </Link>
          <Link
            to="/operations-metrics"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname.startsWith("/operations-metrics")
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            🚀 Métricas Remotas
          </Link>
        </VStack>

        <div className="text-xs text-slate-600 text-center">v1.0.0 · MFE Rsbuild</div>
      </VStack>

      {/* Contenido Principal */}
      <VStack gap={6} className="grow overflow-y-auto ly-p-6">
        {/* Cabecera / Header */}
        <HStack justify="between" align="center" className="pb-4 border-b border-slate-800/60">
          <HStack gap={2} align="center">
            <span className="text-slate-400 text-sm">Dashboard</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-white text-sm font-semibold">
              {isHome ? "Panel Central" : "Métricas de Operaciones"}
            </span>
          </HStack>

          <HStack gap={3}>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50">
              Host: <strong>Puerto 3000</strong>
            </span>
          </HStack>
        </HStack>

        {/* Hero */}
        <Hero />

        {/* Contenido de Ruta */}
        {isHome ? (
          <VStack gap={6}>
            <Grid columns={{ base: 1, md: 3 }} gap={4}>
              <DashboardCard
                title="Llamadas al Servidor (Host)"
                value="24.8K"
                percentage={4.2}
                changeType="positive"
              />
              <DashboardCard
                title="Latencia Promedio FCP"
                value="182ms"
                percentage={12.4}
                changeType="negative"
              />
              {/* Tarjeta DI remota */}
              <DIDashboardCard ctx={ctx} />
            </Grid>

            <VStack
              gap={3}
              className="glass rounded-2xl border border-slate-800 bg-slate-950/20 ly-p-5"
            >
              <h3 className="text-sm font-bold text-white">
                Prueba de Concepto - Module Federation 2.0
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Este dashboard demuestra la compartición de estados, componentes y estilos de forma
                diferida. El menú de **"Métricas Remotas"** está federado. Al hacer clic, se
                descargará el código de `provider-a` (puerto 3001) asíncronamente en el navegador y
                parcheará el router inyectando sus vistas en este mismo árbol de React 19.
              </p>
            </VStack>
          </VStack>
        ) : (
          <Outlet />
        )}

        {/* Footer */}
        <Footer />
      </VStack>
    </HStack>
  );
};
