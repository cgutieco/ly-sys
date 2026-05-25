import { expect, test } from "vitest";
// @ts-ignore
import * as cjsEngine from "../../dist/engine.cjs";
// @ts-ignore
import * as esmEngine from "../../dist/engine.js";
// CJS imports of compiled dist/
// @ts-ignore
import * as cjsFacade from "../../dist/index.cjs";
// ESM imports of compiled dist/
// @ts-ignore
import * as esmFacade from "../../dist/index.js";
// @ts-ignore
import * as cjsPrimitives from "../../dist/primitives.cjs";
// @ts-ignore
import * as esmPrimitives from "../../dist/primitives.js";
// @ts-ignore
import * as cjsProtocol from "../../dist/protocol.cjs";
// @ts-ignore
import * as esmProtocol from "../../dist/protocol.js";
// @ts-ignore
import * as cjsReact from "../../dist/react.cjs";
// @ts-ignore
import * as esmReact from "../../dist/react.js";

test("facade ESM exports work correctly", () => {
  expect(esmFacade.createLayoutEngine).toBeDefined();
  expect(esmFacade.createCandidateCollector).toBeDefined();
  expect(esmFacade.LayoutProvider).toBeDefined();
  expect(esmFacade.useLayout).toBeDefined();
  expect(esmFacade.Flex).toBeDefined();
  expect(esmFacade.Spacer).toBeDefined();
  expect(esmFacade.Grid).toBeDefined();
  expect(esmFacade.HStack).toBeDefined();
  expect(esmFacade.VStack).toBeDefined();
  expect(esmFacade.Center).toBeDefined();
  expect(esmFacade.GridItem).toBeDefined();
  expect(esmFacade.Container).toBeDefined();
});

test("facade CJS exports work correctly", () => {
  expect(cjsFacade.createLayoutEngine).toBeDefined();
  expect(cjsFacade.createCandidateCollector).toBeDefined();
  expect(cjsFacade.LayoutProvider).toBeDefined();
  expect(cjsFacade.useLayout).toBeDefined();
  expect(cjsFacade.Flex).toBeDefined();
  expect(cjsFacade.Spacer).toBeDefined();
  expect(cjsFacade.Grid).toBeDefined();
  expect(cjsFacade.HStack).toBeDefined();
  expect(cjsFacade.VStack).toBeDefined();
  expect(cjsFacade.Center).toBeDefined();
  expect(cjsFacade.GridItem).toBeDefined();
  expect(cjsFacade.Container).toBeDefined();
});

test("subpath ESM exports work correctly", () => {
  expect(esmEngine.createLayoutEngine).toBeDefined();
  expect(esmReact.LayoutProvider).toBeDefined();
  expect(esmReact.useLayout).toBeDefined();
  expect(esmPrimitives.Flex).toBeDefined();
  expect(esmPrimitives.Spacer).toBeDefined();
  expect(esmProtocol.createCandidateCollector).toBeDefined();
});

test("subpath CJS exports work correctly", () => {
  expect(cjsEngine.createLayoutEngine).toBeDefined();
  expect(cjsReact.LayoutProvider).toBeDefined();
  expect(cjsReact.useLayout).toBeDefined();
  expect(cjsPrimitives.Flex).toBeDefined();
  expect(cjsPrimitives.Spacer).toBeDefined();
  expect(cjsProtocol.createCandidateCollector).toBeDefined();
});
