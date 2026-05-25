import type { LayoutService } from "@ly-sys/layout";
import type { ReactNode } from "react";
import { useEffect } from "react";

type DeferredButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  layoutService: LayoutService;
};

export const DeferredButton = ({ children, onClick, layoutService }: DeferredButtonProps) => {
  useEffect(() => {
    // 1. Registramos el CSS diferido (hover avanzado, escala y sombras glow)
    layoutService.registerCandidates(
      {
        candidates: [],
        rawCSS: {
          critical: `
          .providera-btn {
            background-color: var(--ly-color-primary-base, #6366f1);
            padding: 0.625rem 1.25rem;
            border-radius: 0.75rem;
            color: #ffffff;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
          }
        `,
          deferable: `
          .providera-btn {
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, box-shadow 0.3s;
          }
          .providera-btn:hover {
            transform: translateY(-2px);
            background-color: var(--ly-color-primary-hover, #4f46e5);
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          }
          .providera-btn:active {
            transform: translateY(0);
            filter: brightness(0.9);
          }
        `,
        },
      },
      "provider-a-btn",
    );

    // 2. Solicitar inyección diferida en tiempo de inactividad
    layoutService.requestDeferredCSS("provider-a-btn");
  }, [layoutService]);

  return (
    <button onClick={onClick} className="providera-btn">
      {children}
    </button>
  );
};
