import { VStack } from "@ly-sys/layout";

export const Hero = () => (
  <VStack
    gap={4}
    className="glass rounded-2xl border border-slate-700/50 bg-linear-to-r from-indigo-950/40 via-slate-900/50 to-indigo-950/40 relative overflow-hidden ly-p-6"
  >
    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div className="relative z-10">
      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/20 inline-block mb-3">
        Host Shared Component
      </span>
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight mb-2">
        SaaS Operations & <span className="gradient-text">Metrics Dashboard</span>
      </h1>
      <p className="text-slate-400 text-sm max-w-xl">
        Este componente es cargado dinámicamente desde el Host y compartido con el Remoto utilizando
        el contenedor de Inyección de Dependencias IoC.
      </p>
    </div>
  </VStack>
);
