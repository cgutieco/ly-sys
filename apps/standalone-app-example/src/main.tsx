import { CandidateMode, createLayoutEngine, LayoutProvider } from "@ly-sys/layout";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const engine = createLayoutEngine({
  breakpoints: ["base", "sm", "md", "lg"] as const,
  candidateMode: CandidateMode.Off,
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <LayoutProvider engine={engine}>
        <App />
      </LayoutProvider>
    </StrictMode>,
  );
}
