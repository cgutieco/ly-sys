import type { LayoutService } from "@ly-sys/layout";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import accordionDeferableCss from "./InteractiveAccordion.deferable.css?inline";

type InteractiveAccordionProps = {
  title: string;
  content: ReactNode;
  layoutService: LayoutService;
};

export const InteractiveAccordion = ({
  title,
  content,
  layoutService,
}: InteractiveAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Registrar animaciones de altura y opacidad diferidas utilizando el import ?inline
    layoutService.registerCandidates(
      {
        candidates: [],
        rawCSS: {
          deferable: accordionDeferableCss,
        },
      },
      "provider-a-accordion",
    );

    // Diferir inyección
    layoutService.requestDeferredCSS("provider-a-accordion");
  }, [layoutService]);

  return (
    <div className="providera:border providera:border-slate-800 providera:rounded-xl providera:bg-slate-950/20 providera:overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="providera:w-full providera:text-left providera:p-4 providera:font-semibold providera:text-sm providera:text-slate-200 providera:hover:bg-slate-800/20 providera:transition-colors providera:flex providera:justify-between providera:items-center"
      >
        <span>{title}</span>
        <span
          className={`providera:transition-transform providera:duration-300 providera:text-indigo-400 ${isOpen ? "providera:rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="accordion-content-active providera:p-4 providera:bg-slate-900/40 providera:border-t providera:border-slate-800 providera:text-xs providera:text-slate-400 providera:leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
};
