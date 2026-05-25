import type { LayoutService } from "@ly-sys/layout";
import { useEffect } from "react";

type ManualCandidatesWidgetProps = {
  layoutService: LayoutService;
};

export const ManualCandidatesWidget = ({ layoutService }: ManualCandidatesWidgetProps) => {
  useEffect(() => {
    // Escenario real: Dado que usamos clases HTML nativas directas (ej: ly-flex, ly-gap-4)
    // en lugar de los componentes de React (<Flex>, <VStack>), el recolector automático
    // del LayoutProvider de React no puede interceptar estas clases utilitarias.
    //
    // Para asegurarnos de que el Host genere/provea el CSS correspondiente de estas utilidades,
    // las declaramos manualmente en el slot de 'candidates'.
    layoutService.registerCandidates(
      {
        candidates: [
          { utility: "flex" },
          { utility: "flex-row" },
          { utility: "gap-4" },
          { utility: "p-4" },
        ],
      },
      "provider-a-manual-candidates",
    );
  }, [layoutService]);

  return (
    <div className="ly-flex ly-flex-row ly-gap-4 ly-p-4 providera:rounded-xl providera:bg-slate-950/40 providera:border providera:border-slate-800/80 providera:items-center">
      <span className="providera:text-2xl">📦</span>
      <div>
        <h5 className="providera:text-xs providera:font-bold providera:text-slate-300">
          Flexbox Nativo (Candidates Manuales)
        </h5>
        <p className="providera:text-[10px] providera:text-slate-400 providera:leading-relaxed">
          Este bloque está estructurado con etiquetas HTML planas y clases de layout nativas (
          <code>ly-flex</code>,<code>ly-gap-4</code>). Sus estilos correspondientes se declaran de
          manera imperativa en el slot <code>candidates</code>.
        </p>
      </div>
    </div>
  );
};
