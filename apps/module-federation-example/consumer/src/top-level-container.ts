import type { BasicContainer } from "@computerwwwizards/dependency-injection";
import type { ComponentType } from "react";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";

export interface SharedComponents {
  Hero: ComponentType;
  Footer: ComponentType;
}

export interface HostServices {
  "shared-components": SharedComponents;
}

export type HostCtx = BasicContainer<HostServices>;

export const hostServicesPlugin = (ctx: HostCtx) => {
  ctx.bindTo(
    "shared-components",
    () => ({
      Hero,
      Footer,
    }),
    "singleton",
  );
};
