import "@globalStyle/global.scss";
import { createApp } from "vue";
import AppRender from "@/AppRender.vue";
import { vaultPlugin } from "@/plugins/vault";
import { createCustomRouter } from "@/router/index.js";
import { createHead } from "@unhead/vue/client";

export function createCustomApp() {
  const app = createApp(AppRender);
  const router = createCustomRouter();
  const head = createHead();

  app.use(head);
  app.use(vaultPlugin);
  app.use(router);
  return { app, router };
}
