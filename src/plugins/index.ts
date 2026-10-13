import type { App } from "vue";
import { vaultPlugin } from "@/plugins/vault";
import { createCustomRouter } from "@/router/index.js";
import { createHead } from "@unhead/vue/client";

export function setupPlugins(app: App) {
  app.use(vaultPlugin);
  app.use(createCustomRouter());
  app.use(createHead());
}
