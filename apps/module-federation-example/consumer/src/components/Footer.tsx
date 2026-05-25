import { HStack } from "@ly-sys/layout";

export const Footer = () => (
  <HStack
    gap={4}
    align="center"
    justify="between"
    className="border-t border-slate-800/80 bg-slate-900/50 backdrop-blur text-slate-500 text-xs mt-auto rounded-xl ly-p-4"
  >
    <div>
      <span>© 2026 SaaS Operations. Todos los derechos reservados.</span>
    </div>
    <HStack gap={4}>
      <a href="#" className="hover:text-indigo-400 transition-colors">
        Términos
      </a>
      <a href="#" className="hover:text-indigo-400 transition-colors">
        Privacidad
      </a>
      <a href="#" className="hover:text-indigo-400 transition-colors">
        Soporte
      </a>
    </HStack>
  </HStack>
);
