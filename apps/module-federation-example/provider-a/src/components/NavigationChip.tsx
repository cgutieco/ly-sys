import { HStack } from "@ly-sys/layout";
import type { ReactNode } from "react";
import { Link } from "react-router";

type NavigationChipProps = {
  to: string;
  icon: ReactNode;
  label: string;
};

export const NavigationChip = ({ to, icon, label }: NavigationChipProps) => (
  <HStack
    asChild
    gap={2}
    align="center"
    className="providera:px-3.5 providera:py-1.5 providera:rounded-full providera:bg-slate-800/60 providera:hover:bg-slate-800 providera:border providera:border-slate-700/50 providera:text-xs providera:font-semibold providera:text-indigo-300 hover:providera:text-white providera:transition-all"
  >
    <Link to={to}>
      {icon}
      <span>{label}</span>
    </Link>
  </HStack>
);
