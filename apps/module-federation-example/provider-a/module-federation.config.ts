export default {
  name: "providerA",
  dts: false,
  exposes: {
    "./patchOnNavigation": "./src/patch-on-navigation.tsx",
  },
  getPublicPath: "function(){return 'http://localhost:3001/'}",
  shared: {
    react: { singleton: true, requiredVersion: "^19.2.6" },
    "react-dom": { singleton: true, requiredVersion: "^19.2.6" },
    "react-router": { singleton: true, requiredVersion: "^7.15.1" },
    "@ly-sys/layout": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-engine": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-react": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-primitives": { singleton: true, requiredVersion: false },
    "@ly-sys/layout-protocol": { singleton: true, requiredVersion: false },
  },
};
