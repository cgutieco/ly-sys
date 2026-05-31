import tailwindJit from "./tailwind-jit.critical.css?inline";
import globalCritical from "./global.critical.css?inline";
import deferredButtonCritical from "../components/DeferredButton.critical.css?inline";
import deferredButtonDeferable from "../components/DeferredButton.deferable.css?inline";
import interactiveAccordionDeferable from "../components/InteractiveAccordion.deferable.css?inline";
import metricsWidgetDeferable from "../components/MetricsWidget.deferable.css?inline";

export const PROVIDERA_CRITICAL_CSS = [tailwindJit, globalCritical, deferredButtonCritical].join(
  "\n",
);

export const PROVIDERA_DEFERRED_CSS = [
  deferredButtonDeferable,
  interactiveAccordionDeferable,
  metricsWidgetDeferable,
].join("\n");
