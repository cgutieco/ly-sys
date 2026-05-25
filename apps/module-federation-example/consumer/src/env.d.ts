interface ImportMetaEnv {
  readonly remotes: Array<{ name: string; entry: string }>;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
