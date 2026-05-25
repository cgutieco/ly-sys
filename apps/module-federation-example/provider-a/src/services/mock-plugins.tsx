import type { BasicContainer } from "@computerwwwizards/dependency-injection";
import { CandidateMode, createLayoutEngine, createLayoutService } from "@ly-sys/layout";
import type { ComponentType } from "react";

export interface SharedComponents {
  Hero: ComponentType;
  Footer: ComponentType;
}

export interface InheritedServices {
  "shared-components": SharedComponents;
  "layout-service": import("@ly-sys/layout").LayoutService;
}

export interface RemoteServices {
  "metrics-provider": {
    getCardData(): Promise<{ title: string; value: string; percentage: number }>;
  };
}

export type RemoteCtx = BasicContainer<RemoteServices & InheritedServices>;

// Mocks para components compartidos del Host en modo Standalone
const MockHero = () => (
  <div className="providera:p-6 providera:rounded-xl providera:bg-slate-800/80 providera:border providera:border-slate-700 providera:mb-6">
    <h1 className="providera:text-2xl providera:font-bold providera:text-indigo-400">
      Mock Hero Standalone (Remote)
    </h1>
    <p className="providera:text-xs providera:text-slate-400">
      Esta es una vista previa del Hero del Host cargada localmente.
    </p>
  </div>
);

const MockFooter = () => (
  <div className="providera:p-4 providera:rounded-lg providera:bg-slate-800/40 providera:border providera:border-slate-700/50 providera:text-center providera:text-xs providera:text-slate-500 providera:mt-8">
    <span>Mock Footer Standalone (Remote) - ly-sys</span>
  </div>
);

export const mockHostServicesPlugin = (ctx: RemoteCtx) => {
  ctx.bindTo(
    "shared-components",
    () => ({
      Hero: MockHero,
      Footer: MockFooter,
    }),
    "singleton",
  );

  ctx.bindTo(
    "layout-service",
    () => {
      const engine = createLayoutEngine({
        libPrefix: "ly",
        appPrefix: "app",
        breakpoints: ["base", "sm", "md", "lg"] as const,
        candidateMode: CandidateMode.Off,
      });

      return createLayoutService({ engine });
    },
    "singleton",
  );
};
