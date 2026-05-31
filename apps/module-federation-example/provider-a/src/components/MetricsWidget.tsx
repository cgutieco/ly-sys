import { Grid, GridItem, HStack, VStack } from "@ly-sys/layout";
import type { RemoteCtx } from "../services/mock-plugins";
import { DeferredButton } from "./DeferredButton";
import { InteractiveAccordion } from "./InteractiveAccordion";
import { ManualCandidatesWidget } from "./ManualCandidatesWidget";
import { NavigationChip } from "./NavigationChip";

type MetricsWidgetProps = {
  ctx: RemoteCtx;
};

export const MetricsWidget = ({ ctx }: MetricsWidgetProps) => {
  // Obtener componentes compartidos del contenedor DI
  const shared = ctx.get("shared-components");
  const { Hero, Footer } = shared;

  // Obtener el layout service
  const layoutService = ctx.get("layout-service");

  return (
    <VStack gap={6} className="providera:w-full providera:p-6">
      {/* 1. Componente Hero compartido por el Host */}
      <Hero />

      {/* 2. Sección del Módulo Remoto */}
      <VStack
        gap={4}
        className="providera:rounded-2xl providera:border providera:border-slate-800 providera:bg-slate-900/40 providera:backdrop-blur providera:relative ly-p-5"
      >
        <HStack align="center" justify="between">
          <VStack gap={1}>
            <span className="providera:text-xs providera:font-semibold providera:uppercase providera:tracking-wider providera:text-indigo-400">
              Remote Module: provider-a
            </span>
            <h2 className="providera:text-xl providera:font-bold providera:text-white">
              Panel de Métricas del Servidor
            </h2>
          </VStack>

          <span className="providera:text-xs providera:bg-slate-800 providera:text-slate-300 providera:px-3 providera:py-1.5 providera:rounded-full providera:border providera:border-slate-700/50">
            Remote: <strong>Puerto 3001</strong>
          </span>
        </HStack>

        <p className="providera:text-slate-400 providera:text-xs providera:leading-relaxed providera:max-w-2xl">
          Esta sección completa, incluyendo el layout interno y los componentes interactivos, se
          compila e inyecta desde un servidor independiente. Las primitivas de layout heredan la
          caché y configuración del host de manera transparente.
        </p>

        {/* Ejemplo de NavigationChip con asChild de ly-sys */}
        <HStack gap={3}>
          <NavigationChip
            to="/"
            icon={<span className="providera:text-xs">🏠</span>}
            label="Volver al Panel Principal (Host)"
          />
          <NavigationChip
            to="/operations-metrics"
            icon={<span className="providera:text-xs">🔄</span>}
            label="Recargar Métricas"
          />
        </HStack>

        {/* Cuadrícula de Métricas de Operaciones Remotas */}
        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} className="providera:mt-4">
          <GridItem colSpan={{ base: 1, sm: 2, lg: 2 }} colStart={{ lg: 1 }} rowStart={{ lg: 1 }}>
            <VStack
              gap={1}
              className="providera:rounded-xl providera:bg-slate-950/40 providera:border providera:border-slate-800/80 ly-p-4"
            >
              <span className="providera:text-xs providera:text-slate-500">
                Tasa de Entrega HTTP
              </span>
              <span className="providera:text-xl providera:font-bold providera:text-white">
                99.98%
              </span>
              <span className="providera:text-[10px] providera:text-emerald-400">Estable</span>
            </VStack>
          </GridItem>

          <GridItem
            colSpan={{ base: 1, sm: 1, lg: 1 }}
            rowSpan={{ lg: 2 }}
            colStart={{ lg: 3 }}
            rowStart={{ lg: 1 }}
          >
            <VStack
              gap={1}
              className="providera:rounded-xl providera:bg-slate-950/40 providera:border providera:border-slate-800/80 ly-p-4"
            >
              <span className="providera:text-xs providera:text-slate-500">
                Tiempo de Inyección CSS
              </span>
              <span className="providera:text-xl providera:font-bold providera:text-white">
                0.45ms
              </span>
              <span className="providera:text-[10px] providera:text-emerald-400">
                -5.2% vs promedio
              </span>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, sm: 1, lg: 2 }} colStart={{ lg: 1 }} rowStart={{ lg: 2 }}>
            <VStack
              gap={1}
              className="providera:rounded-xl providera:bg-slate-950/40 providera:border providera:border-slate-800/80 ly-p-4"
            >
              <span className="providera:text-xs providera:text-slate-500">
                CSS Candidates Colectados
              </span>
              <span className="providera:text-xl providera:font-bold providera:text-white">
                12 Activos
              </span>
              <span className="providera:text-[10px] providera:text-indigo-400">
                Deduplicado por Host
              </span>
            </VStack>
          </GridItem>
        </Grid>

        {/* Caso de Uso 1: Deferred CSS Button */}
        <VStack
          gap={2}
          className="providera:rounded-xl providera:bg-slate-950/20 providera:border providera:border-slate-800/60 providera:mt-2 ly-p-4"
        >
          <h4 className="providera:text-xs providera:font-bold providera:text-slate-300">
            Botón de Acción Diferido
          </h4>
          <p className="providera:text-[11px] providera:text-slate-400">
            El siguiente botón carga sus estilos de hover e interactividad (sombras glow,
            transiciones, etc.) de forma asíncrona mediante un bloque CSS diferido registrado en el
            layoutService.
          </p>
          <HStack>
            <DeferredButton onClick={() => alert("¡Hiciste clic en el botón con CSS diferido!")}>
              Inyectar CSS e Interactuar
            </DeferredButton>
          </HStack>
        </VStack>

        {/* Caso de Uso 2: Accordion con Animaciones Diferidas */}
        <VStack gap={2} className="providera:mt-2">
          <h4 className="providera:text-xs providera:font-bold providera:text-slate-300">
            Acordeones de Información Operativa
          </h4>
          <p className="providera:text-[11px] providera:text-slate-400">
            Al abrir los acordeones se ejecuta una animación `@keyframes slideDown` que se inyecta
            en el DOM de forma diferida, evitando sobrecargar el bundle de estilos inicial.
          </p>
          <InteractiveAccordion
            title="Ver Logs de Transacciones (Remoto)"
            content={
              <VStack gap={2}>
                <div className="providera:font-mono providera:text-indigo-300">
                  [12:44:01] GET /api/v1/metrics - 200 OK (14ms)
                </div>
                <div className="providera:font-mono providera:text-indigo-300">
                  [12:44:03] POST /api/v1/candidates - 201 Created (42ms)
                </div>
                <div className="providera:font-mono providera:text-indigo-300">
                  [12:44:08] GET /api/v1/layout/styles - 304 Not Modified (2ms)
                </div>
              </VStack>
            }
            layoutService={layoutService}
          />
          <InteractiveAccordion
            title="Diagnóstico del Motor ly-sys"
            content="El LayoutEngine se ejecuta en modo off-candidate en producción. Se aprovecha la optimización de caché LRU para evitar que la resolución de colisiones y prioridades de clases de estilos impacte en el hilo principal durante re-renders."
            layoutService={layoutService}
          />
        </VStack>

        {/* Caso de Uso 3: Candidates de Layout Manuales */}
        <VStack gap={2} className="providera:mt-2">
          <h4 className="providera:text-xs providera:font-bold providera:text-slate-300">
            Detección Manual de Candidates
          </h4>
          <p className="providera:text-[11px] providera:text-slate-400">
            A continuación se renderiza un bloque de HTML nativo. Dado que no utiliza las primitivas
            de React del layout, sus candidatos se registran de forma explícita.
          </p>
          <ManualCandidatesWidget layoutService={layoutService} />
        </VStack>
      </VStack>

      {/* 3. Componente Footer compartido por el Host */}
      <Footer />
    </VStack>
  );
};
