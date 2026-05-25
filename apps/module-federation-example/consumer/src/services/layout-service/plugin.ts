import { CandidateMode, createLayoutEngine, createLayoutService } from "@ly-sys/layout";
import type { HostCtx } from "../../top-level-container";

declare module "../../top-level-container" {
  interface HostServices {
    "layout-service": import("@ly-sys/layout").LayoutService;
  }
}

export const layoutServicePlugin = (ctx: HostCtx) => {
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
