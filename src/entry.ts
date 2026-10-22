import { createCustomApp } from "@/main";

const { app, router } = createCustomApp();

router.isReady().then(() => {
  app.mount("#app");
});
