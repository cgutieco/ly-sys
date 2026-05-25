import type {
  CandidateCollector,
  CandidateMode,
  LayerMode,
  ValidationMode,
} from "@ly-sys/layout-protocol";

export type ResponsiveValue<T, B extends string> = T | Partial<Record<B, T>>;

export type PropRule = {
  scale?: readonly (string | number)[];
  allowArbitrary?: boolean;
  tokenVar?: (value: number | string) => string;
};

export type EngineConfig<B extends string> = {
  libPrefix?: string;
  appPrefix?: string;
  breakpoints: readonly B[];
  layerMode?: LayerMode; // default: LayerMode.Full
  layerName?: string; // default: 'layout'
  validationMode?: ValidationMode; // default: ValidationMode.Strict
  propRules?: Record<string, PropRule>;
  candidateMode?: CandidateMode; // default: CandidateMode.Off
};

export type LayoutEngine<B extends string> = {
  readonly config: Readonly<EngineConfig<B>>;
  resolve: (generated: string, user?: string) => string;
  parseResponsive: <T extends string | number>(
    value: ResponsiveValue<T, B>,
    propName: string,
    utilityFn: (val: T) => string,
  ) => string;
  prefix: (className: string) => string;
  createCandidateCollector: () => CandidateCollector;
};
