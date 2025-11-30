/**
 * Design System Plugin
 * UI Components for Gravity workflow system
 */

import { createPlugin, type GravityPluginAPI } from "@gravityai-dev/plugin-base";
import packageJson from "../package.json";
import * as path from "path";

const plugin = createPlugin({
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,

  async setup(api: GravityPluginAPI) {
    // Register this package's path for component serving
    // __dirname is dist/src, so go up twice to get package root
    const packagePath = path.join(__dirname, "../..");

    if (api.registerComponentPath) {
      api.registerComponentPath(packagePath);
    }
    // Set platform dependencies for this package
    const { setPlatformDependencies } = await import("@gravityai-dev/plugin-base");
    setPlatformDependencies({
      PromiseNode: api.classes.PromiseNode,
      CallbackNode: api.classes.CallbackNode,
      NodeInputType: api.types.NodeInputType,
      NodeConcurrency: api.types.NodeConcurrency,
      getNodeCredentials: api.getNodeCredentials,
      getConfig: api.getConfig,
      createLogger: api.createLogger,
      saveTokenUsage: api.saveTokenUsage,
      callService: api.callService,
      getRedisClient: api.getRedisClient,
      gravityPublish: api.gravityPublish,
      executeNodeWithRouting: api.executeNodeWithRouting,
      getAudioWebSocketManager: api.getAudioWebSocketManager,
    });

    // Ingest Storybook components and auto-register as workflow nodes
    const { ingestComponents } = await import("../scripts/ingestion");
    await ingestComponents(api);
  },
});

export default plugin;
