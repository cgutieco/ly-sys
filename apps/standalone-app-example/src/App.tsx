import { Center, Container, Flex, Grid, GridItem, HStack, Spacer, VStack } from "@ly-sys/layout";
import { useEffect, useState } from "react";

export const App = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("engine");
  const [layoutGridCols, setLayoutGridCols] = useState<any>(3);
  const [cyberStatus, setCyberStatus] = useState("SYSTEM_ONLINE");

  // Manage dark/light class on document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Cyberpunk console log simulation
  useEffect(() => {
    const intervals = [
      "CORE_INIT",
      "DEDUPLICATING_CLASSES",
      "RESOLVING_COLLISIONS",
      "SYSTEM_ONLINE",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % intervals.length;
      setCyberStatus(intervals[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-800">
      {/* 1. HEADER / NAVBAR (Using HStack, Spacer & Container) */}
      <header className="sticky top-0 z-50 backdrop-blur-md dark:bg-slate-950/70 bg-slate-50/70 border-b dark:border-slate-900 border-slate-200">
        <Container maxWidth="7xl" className="py-4">
          <HStack align="center" className="w-full">
            {/* Logo */}
            <HStack gap={2} align="center" className="cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-cyber-pink to-cyber-cyan flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-md">
                🧬
              </div>
              <span className="text-xl font-black tracking-widest dark:text-white text-slate-900 neon-text-cyan">
                CYBERNETIC<span className="dark:text-cyber-pink text-purple-600">.LY</span>
              </span>
            </HStack>

            <Spacer />

            {/* Menu Links (Hidden on small screens) */}
            <HStack gap={6} align="center" className="hidden md:flex">
              <a
                href="#hero"
                className="text-sm font-semibold dark:text-slate-300 text-slate-600 dark:hover:text-cyber-cyan hover:text-purple-600 transition-colors"
              >
                NEXUS
              </a>
              <a
                href="#features"
                className="text-sm font-semibold dark:text-slate-300 text-slate-600 dark:hover:text-cyber-cyan hover:text-purple-600 transition-colors"
              >
                MATRIX
              </a>
              <a
                href="#sandbox"
                className="text-sm font-semibold dark:text-slate-300 text-slate-600 dark:hover:text-cyber-cyan hover:text-purple-600 transition-colors"
              >
                SANDBOX
              </a>
              <a
                href="#specs"
                className="text-sm font-semibold dark:text-slate-300 text-slate-600 dark:hover:text-cyber-cyan hover:text-purple-600 transition-colors"
              >
                SPECS
              </a>
            </HStack>

            <Spacer />

            {/* Light/Dark Toggle & Actions */}
            <HStack gap={4} align="center">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-10 h-10 rounded-xl dark:bg-slate-900 bg-slate-200 dark:hover:bg-slate-800 hover:bg-slate-300 flex items-center justify-center text-lg border dark:border-slate-800 border-slate-300 cursor-pointer select-none transition-all shadow-xs"
                title="Toggle Matrix Theme"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              <a
                href="#sandbox"
                className="relative hidden sm:inline-block px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase border overflow-hidden transition-all dark:bg-slate-950 bg-slate-900 dark:text-cyber-cyan text-white dark:border-cyber-cyan/50 border-slate-950 dark:hover:bg-cyber-cyan/10 hover:bg-slate-800 hover:scale-105"
              >
                LINK_CORE
              </a>
            </HStack>
          </HStack>
        </Container>
      </header>

      {/* 2. HERO SECTION (Using Grid, GridItem & VStack) */}
      <section id="hero" className="py-20 relative overflow-hidden">
        {/* Abstract Background Neons */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full dark:bg-cyber-pink/5 bg-purple-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/10 w-96 h-96 rounded-full dark:bg-cyber-cyan/5 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

        <Container maxWidth="7xl">
          <Grid columns={{ base: 1, md: 2 }} gap={12} className="items-center">
            {/* Left Content */}
            <GridItem>
              <VStack gap={6} align="start" className="max-w-xl">
                {/* Micro Tag */}
                <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase border dark:border-cyber-cyan/40 border-purple-500/30 rounded-full dark:bg-cyber-cyan/5 bg-purple-500/5 dark:text-cyber-cyan text-purple-600">
                  ⚡ ENGINE STATUS: {cyberStatus}
                </span>

                {/* Glitch Title */}
                <h1
                  className="text-4xl sm:text-6xl font-black tracking-tighter dark:text-white text-slate-900 leading-none uppercase glitch-effect"
                  data-text="LAYOUT SYSTEM WITHOUT OVERHEAD"
                >
                  LAYOUT SYSTEM <br />
                  WITHOUT{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r dark:from-cyber-cyan dark:to-cyber-pink from-purple-600 to-pink-500">
                    OVERHEAD
                  </span>
                </h1>

                <p className="text-base dark:text-slate-400 text-slate-600 leading-relaxed">
                  Welcome to the light speed layout engine. Unify your CSS, eliminate redundancy,
                  and structure your React view matrix natively with zero-overhead layout
                  primitives. No dynamic server-side compilation needed.
                </p>

                <HStack gap={4} className="w-full sm:w-auto">
                  <a
                    href="#sandbox"
                    className="flex-1 sm:flex-initial text-center px-8 py-4 rounded-xl text-sm font-black tracking-widest uppercase bg-linear-to-r dark:from-cyber-cyan dark:to-cyber-pink from-purple-600 to-pink-500 text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    ENTER_SANDBOX
                  </a>
                  <a
                    href="#features"
                    className="flex-1 sm:flex-initial text-center px-8 py-4 rounded-xl text-sm font-black tracking-widest uppercase border dark:border-slate-800 border-slate-300 dark:bg-slate-900/50 bg-white/80 dark:hover:bg-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    SYSTEM_MATRIX
                  </a>
                </HStack>
              </VStack>
            </GridItem>

            {/* Right Interactive Cyber Terminal */}
            <GridItem>
              <VStack
                gap={3}
                className="w-full dark:bg-slate-950/70 bg-white/85 rounded-2xl border dark:border-slate-900 border-slate-200 dark:neon-border-cyan neon-border-pink relative overflow-hidden p-6"
              >
                {/* Terminal Header */}
                <HStack
                  align="center"
                  justify="between"
                  className="w-full pb-3 border-b dark:border-slate-900 border-slate-200"
                >
                  <HStack gap={2}>
                    <div className="w-3 h-3 rounded-full bg-cyber-pink"></div>
                    <div className="w-3 h-3 rounded-full bg-cyber-yellow"></div>
                    <div className="w-3 h-3 rounded-full bg-cyber-cyan"></div>
                  </HStack>
                  <span className="text-[10px] font-mono dark:text-slate-500 text-slate-400">
                    {"bash // ly-sys-layout-monitor"}
                  </span>
                </HStack>

                {/* Terminal Screen Code */}
                <div className="font-mono text-xs dark:text-cyber-green text-emerald-600 space-y-2 py-2 overflow-x-auto w-full">
                  <p className="dark:text-slate-500 text-slate-400">
                    {"// Importing layout components"}
                  </p>
                  <p>
                    <span className="dark:text-cyber-pink text-pink-600">import</span> &#123;{" "}
                    <span className="dark:text-cyber-cyan text-blue-600">
                      Grid, GridItem, VStack
                    </span>{" "}
                    &#125; <span className="dark:text-cyber-pink text-pink-600">from</span>{" "}
                    <span className="dark:text-cyber-yellow text-amber-600">"@ly-sys/layout"</span>
                    {" ;"}
                  </p>

                  <p className="pt-2 dark:text-slate-500 text-slate-400">
                    {"// Pure responsive layout architecture"}
                  </p>
                  <p>
                    &lt;<span className="dark:text-cyber-cyan text-blue-600">Grid</span>{" "}
                    columns=&#123;&#123; base: 1, md: 3 &#125;&#125; gap=&#123;4&#125;&gt;
                  </p>
                  <p className="pl-4">
                    &lt;<span className="dark:text-cyber-cyan text-blue-600">GridItem</span>{" "}
                    colSpan=&#123;&#123; base: 1, md: 2 &#125;&#125;&gt;
                  </p>
                  <p className="pl-8">
                    &lt;<span className="dark:text-cyber-cyan text-blue-600">VStack</span>{" "}
                    gap=&#123;3&#125;&gt;
                  </p>
                  <p className="pl-12">&lt;h2&gt;NEXUS CORE ACTIVE&lt;/h2&gt;</p>
                  <p className="pl-8">
                    &lt;/<span className="dark:text-cyber-cyan text-blue-600">VStack</span>&gt;
                  </p>
                  <p className="pl-4">
                    &lt;/<span className="dark:text-cyber-cyan text-blue-600">GridItem</span>&gt;
                  </p>
                  <p>
                    &lt;/<span className="dark:text-cyber-cyan text-blue-600">Grid</span>&gt;
                  </p>
                </div>

                {/* Terminal Output Logs */}
                <div className="w-full rounded-lg dark:bg-slate-900 bg-slate-100 p-3 font-mono text-[10px] dark:text-slate-400 text-slate-600 border dark:border-slate-800 border-slate-200">
                  <p className="dark:text-cyber-cyan text-purple-600">
                    📡 [MONITOR] Connecting to DOM Layout...
                  </p>
                  <p>✔ Active Lib Prefix: ly-sys (Default Prefix)</p>
                  <p>✔ Active App Prefix: None</p>
                  <p>⚡ Render cycle time: 0.05ms (Native Class Resolution)</p>
                </div>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </section>

      {/* 3. FEATURES SECTION (Using VStack, Grid & GridItem) */}
      <section
        id="features"
        className="py-20 border-t dark:border-slate-900 border-slate-200 dark:bg-slate-950 bg-slate-100/50"
      >
        <Container maxWidth="7xl">
          <VStack gap={4} align="center" className="w-full text-center mb-16">
            <span className="text-xs font-black tracking-widest uppercase dark:text-cyber-pink text-pink-600">
              SYSTEM FEATURES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase dark:text-white text-slate-900">
              BUILD THE MATRIX
            </h2>
            <p className="text-sm dark:text-slate-400 text-slate-600 max-w-xl">
              Four nodes operating in complete harmony. High-performance styling meets structured
              layouts.
            </p>
          </VStack>

          {/* Cards Grid */}
          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {/* Feature 1 */}
            <GridItem>
              <VStack
                gap={4}
                className="h-full p-6 dark:bg-slate-900/40 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:hover:neon-border-cyan hover:neon-border-pink transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyber-cyan flex items-center justify-center text-xl font-bold dark:group-hover:bg-cyber-cyan dark:group-hover:text-slate-950 transition-colors">
                  ⚡
                </div>
                <h3 className="text-lg font-bold uppercase dark:text-white text-slate-900">
                  CORE ENGINE
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                  Responsive values compiled instantly. Combines base settings and responsive
                  coordinates under a high-speed LRU cache.
                </p>
              </VStack>
            </GridItem>

            {/* Feature 2 */}
            <GridItem>
              <VStack
                gap={4}
                className="h-full p-6 dark:bg-slate-900/40 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:hover:neon-border-pink hover:neon-border-pink transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-cyber-pink flex items-center justify-center text-xl font-bold dark:group-hover:bg-cyber-pink dark:group-hover:text-slate-950 transition-colors">
                  📡
                </div>
                <h3 className="text-lg font-bold uppercase dark:text-white text-slate-900">
                  COLLISION RESOLVER
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                  Ensures correct CSS overrides. Custom classes resolve priorities dynamically: App
                  overrides Lib, rightmost class wins.
                </p>
              </VStack>
            </GridItem>

            {/* Feature 3 */}
            <GridItem>
              <VStack
                gap={4}
                className="h-full p-6 dark:bg-slate-900/40 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:hover:neon-border-green hover:neon-border-pink transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-cyber-green flex items-center justify-center text-xl font-bold dark:group-hover:bg-cyber-green dark:group-hover:text-slate-950 transition-colors">
                  🧬
                </div>
                <h3 className="text-lg font-bold uppercase dark:text-white text-slate-900">
                  FLEX & GRID NODES
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                  Rich structures with VStack, HStack, Spacer, and polymorphic Containers. Easy
                  nesting of layouts.
                </p>
              </VStack>
            </GridItem>

            {/* Feature 4 */}
            <GridItem>
              <VStack
                gap={4}
                className="h-full p-6 dark:bg-slate-900/40 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:hover:neon-border-cyan hover:neon-border-pink transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl font-bold dark:group-hover:bg-purple-500 dark:group-hover:text-slate-950 transition-colors">
                  🛡️
                </div>
                <h3 className="text-lg font-bold uppercase dark:text-white text-slate-900">
                  ZERO COLLISION
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                  Strict stylesheet layers (`global`, `layout`, `components`, `utils`) to maintain
                  CSS cascade control.
                </p>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </section>

      {/* 4. INTERACTIVE SANDBOX (Using Grid, GridItem, VStack, HStack, and state) */}
      <section id="sandbox" className="py-20 border-t dark:border-slate-900 border-slate-200">
        <Container maxWidth="7xl">
          <VStack gap={4} align="center" className="w-full text-center mb-16">
            <span className="text-xs font-black tracking-widest uppercase dark:text-cyber-cyan text-purple-600">
              INTERACTIVE NEURAL MATRIX
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase dark:text-white text-slate-900">
              LAYOUT SANDBOX
            </h2>
            <p className="text-sm dark:text-slate-400 text-slate-600 max-w-xl">
              Tweak the parameters below to see the `Grid` and `GridItem` layout primitives
              re-arrange dynamically.
            </p>
          </VStack>

          <Grid columns={{ base: 1, md: 3 }} gap={8}>
            {/* Left Controls Column (1 Col) */}
            <GridItem colSpan={{ base: 1, md: 1 }}>
              <VStack
                gap={6}
                className="p-6 dark:bg-slate-900/30 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:neon-border-cyan neon-border-pink"
              >
                <h3 className="text-md font-bold uppercase tracking-wider dark:text-white text-slate-900 border-b dark:border-slate-900 border-slate-200 pb-2">
                  MATRIX CONTROL
                </h3>

                {/* Control 1: Columns */}
                <VStack gap={2} align="start" className="w-full">
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-500">
                    GRID COLUMNS ({layoutGridCols})
                  </span>
                  <HStack gap={2} className="w-full">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        onClick={() => setLayoutGridCols(col)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          layoutGridCols === col
                            ? "dark:bg-cyber-cyan bg-purple-600 dark:text-slate-950 text-white border-transparent shadow-md"
                            : "dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-300"
                        }`}
                      >
                        {col} COL
                      </button>
                    ))}
                  </HStack>
                </VStack>

                {/* Control 2: Active Tab / Component Code */}
                <VStack gap={2} align="start" className="w-full">
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-500">
                    PRIMITIVE SCHEMAS
                  </span>
                  <VStack gap={2} className="w-full">
                    {[
                      { id: "engine", label: "LayoutEngine config" },
                      { id: "grid", label: "Grid Component markup" },
                      { id: "css", label: "Computed Layer CSS" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? "dark:bg-cyber-pink bg-pink-500 text-white border-transparent"
                            : "dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </VStack>
                </VStack>

                {/* Code display inside Controls */}
                <div className="w-full p-4 rounded-xl dark:bg-slate-950 bg-slate-950 font-mono text-[10px] text-slate-300 border dark:border-slate-900 border-slate-800 overflow-x-auto min-h-24">
                  {activeTab === "engine" && (
                    <pre className="text-cyan-400">
                      {`const engine = createLayoutEngine({
  // libPrefix defaults to "ly-sys"
  // appPrefix defaults to ""
  breakpoints: ["base", "sm", "md", "lg"],
  candidateMode: CandidateMode.Off
});`}
                    </pre>
                  )}
                  {activeTab === "grid" && (
                    <pre className="text-pink-400">
                      {`<Grid columns={${layoutGridCols}} gap={4}>
  <GridItem colSpan={1}>CORE</GridItem>
  <GridItem colSpan={2}>SHELL</GridItem>
</Grid>`}
                    </pre>
                  )}
                  {activeTab === "css" && (
                    <pre className="text-emerald-400">
                      {`.ly-sys-grid-cols-${layoutGridCols} {
  grid-template-columns: repeat(${layoutGridCols}, minmax(0, 1fr));
}
.ly-sys-gap-4 {
  gap: 1rem; /* Inherited directly from @ly-sys/layout/styles.css */
}`}
                    </pre>
                  )}
                </div>
              </VStack>
            </GridItem>

            {/* Right Sandbox Visualization Column (2 Cols) */}
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <VStack
                gap={4}
                className="w-full h-full p-6 dark:bg-slate-900/20 bg-white rounded-2xl border dark:border-slate-900 border-slate-200 dark:neon-border-pink neon-border-pink relative min-h-96"
              >
                {/* Visualizer header */}
                <HStack align="center" justify="between" className="w-full">
                  <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                    LIVE RENDER VIEW
                  </span>
                  <span className="text-[10px] font-mono dark:text-cyber-green text-emerald-600">
                    STATE: UPDATED
                  </span>
                </HStack>

                {/* Simulated Grid Primitives rendering dynamically */}
                <div className="w-full flex-grow flex items-center justify-center p-4 border dark:border-slate-800 border-slate-200 rounded-xl dark:bg-slate-950/40 bg-slate-50">
                  <Grid columns={layoutGridCols} gap={4} className="w-full">
                    <GridItem colSpan={1}>
                      <Center className="h-28 rounded-xl dark:bg-slate-900/80 bg-white border dark:border-cyber-cyan/30 border-purple-500/20 shadow-xs flex-col p-4 text-center group cursor-pointer hover:scale-102 transition-all">
                        <span className="text-lg font-bold text-cyber-cyan neon-text-cyan">
                          {"01 // CORE"}
                        </span>
                        <span className="text-[9px] font-mono dark:text-slate-500 text-slate-400 pt-1">
                          colSpan = 1
                        </span>
                      </Center>
                    </GridItem>

                    <GridItem
                      colSpan={layoutGridCols > 1 ? 2 : 1}
                      className="transition-all duration-300"
                    >
                      <Center className="h-28 rounded-xl dark:bg-slate-900/80 bg-white border dark:border-cyber-pink/30 border-pink-500/20 shadow-xs flex-col p-4 text-center group cursor-pointer hover:scale-102 transition-all">
                        <span className="text-lg font-bold text-cyber-pink neon-text-pink">
                          {"02 // SHELL"}
                        </span>
                        <span className="text-[9px] font-mono dark:text-slate-500 text-slate-400 pt-1">
                          colSpan = {layoutGridCols > 1 ? 2 : 1}
                        </span>
                      </Center>
                    </GridItem>

                    <GridItem colSpan={1}>
                      <Center className="h-28 rounded-xl dark:bg-slate-900/80 bg-white border dark:border-cyber-green/30 border-emerald-500/20 shadow-xs flex-col p-4 text-center group cursor-pointer hover:scale-102 transition-all">
                        <span className="text-lg font-bold text-cyber-green neon-text-green">
                          {"03 // MATRIX"}
                        </span>
                        <span className="text-[9px] font-mono dark:text-slate-500 text-slate-400 pt-1">
                          colSpan = 1
                        </span>
                      </Center>
                    </GridItem>
                  </Grid>
                </div>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </section>

      {/* 5. TECH SPECS (Using Grid & GridItem) */}
      <section
        id="specs"
        className="py-20 border-t dark:border-slate-900 border-slate-200 dark:bg-slate-950 bg-slate-100/50"
      >
        <Container maxWidth="7xl">
          <Grid columns={{ base: 1, md: 3 }} gap={8} className="items-center">
            {/* Title Column */}
            <GridItem colSpan={1}>
              <VStack gap={4} align="start" className="max-w-xs">
                <span className="text-xs font-black tracking-widest uppercase dark:text-cyber-green text-emerald-600">
                  ARCHITECTURE SPECIFICATIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase dark:text-white text-slate-900 leading-none">
                  TECH <br />
                  MATRIX
                </h2>
                <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
                  High efficiency specs optimized for modern browser engines. Co-exists perfectly
                  with CSS Custom layers.
                </p>
              </VStack>
            </GridItem>

            {/* Technical Specs List Grid (2 cols) */}
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Grid columns={{ base: 1, sm: 2 }} gap={6}>
                {/* Spec 1 */}
                <div className="p-5 dark:bg-slate-900/30 bg-white rounded-xl border dark:border-slate-900 border-slate-200">
                  <span className="text-xs font-mono dark:text-cyber-cyan text-purple-600 font-bold block mb-1">
                    {"01 // BROWSER COMPATIBILITY"}
                  </span>
                  <span className="text-sm font-bold uppercase dark:text-white text-slate-900 block mb-2">
                    CSS Layers Standard
                  </span>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
                    Uses the native `@layer` directive supported by all modern evergreen browsers
                    (Chrome 99+, Safari 15.4+, Firefox 97+).
                  </p>
                </div>

                {/* Spec 2 */}
                <div className="p-5 dark:bg-slate-900/30 bg-white rounded-xl border dark:border-slate-900 border-slate-200">
                  <span className="text-xs font-mono dark:text-cyber-pink text-pink-600 font-bold block mb-1">
                    {"02 // MEMORY CAPACITY"}
                  </span>
                  <span className="text-sm font-bold uppercase dark:text-white text-slate-900 block mb-2">
                    LRU Memory Cap
                  </span>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
                    LRU cache strictly capped at 500 nodes to prevent memory leaks during reactive
                    UI loops.
                  </p>
                </div>

                {/* Spec 3 */}
                <div className="p-5 dark:bg-slate-900/30 bg-white rounded-xl border dark:border-slate-900 border-slate-200">
                  <span className="text-xs font-mono dark:text-cyber-green text-emerald-600 font-bold block mb-1">
                    {"03 // RENDERING TIME"}
                  </span>
                  <span className="text-sm font-bold uppercase dark:text-white text-slate-900 block mb-2">
                    Instant Cache Lookup
                  </span>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
                    Style resolution executes in O(1) complexity under cache hit. Resolves 10k class
                    iterations under 2ms.
                  </p>
                </div>

                {/* Spec 4 */}
                <div className="p-5 dark:bg-slate-900/30 bg-white rounded-xl border dark:border-slate-900 border-slate-200">
                  <span className="text-xs font-mono dark:text-cyber-yellow text-amber-600 font-bold block mb-1">
                    {"04 // POLYMORPHISM"}
                  </span>
                  <span className="text-sm font-bold uppercase dark:text-white text-slate-900 block mb-2">
                    asChild Semantic Markup
                  </span>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
                    Radix UI Slot primitive integrated within layout nodes to support semantic tags
                    without wrapper clutter.
                  </p>
                </div>
              </Grid>
            </GridItem>
          </Grid>
        </Container>
      </section>

      {/* 6. FOOTER (Using Container, VStack, HStack, Spacer) */}
      <footer className="py-12 border-t dark:border-slate-900 border-slate-200 dark:bg-slate-950 bg-slate-900 text-slate-400">
        <Container maxWidth="7xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            className="w-full items-center justify-between"
          >
            <VStack gap={1} align={{ base: "center", md: "start" } as any}>
              <HStack gap={2} align="center">
                <span className="text-lg font-black tracking-widest text-white">
                  CYBERNETIC<span className="text-cyber-pink">.LY</span>
                </span>
              </HStack>
              <p className="text-xs text-slate-500 text-center md:text-left">
                High-performance CSS layouts built on standard browser protocols.
              </p>
            </VStack>

            <Spacer className="hidden md:block" />

            <span className="text-xs text-slate-500 font-mono">
              © {new Date().getFullYear()} CYBERNETIC.LY · OPERATING_SYSTEM_STABLE
            </span>
          </Flex>
        </Container>
      </footer>
    </div>
  );
};
