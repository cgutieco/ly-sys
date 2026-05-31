import type { ReactNode } from "react";

type DeferredButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export const DeferredButton = ({ children, onClick }: DeferredButtonProps) => (
  <button onClick={onClick} className="providera-btn">
    {children}
  </button>
);
