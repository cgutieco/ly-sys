export default {
  name: "host",
  dts: false,
  shared: {
    react: { singleton: true, requiredVersion: "^19.2.6", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^19.2.6", eager: true },
    "react-router": { singleton: true, requiredVersion: "^7.15.1" },
    "@ly-sys/layout": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-engine": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-react": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-primitives": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-protocol": { singleton: true, requiredVersion: false },
  },
};
