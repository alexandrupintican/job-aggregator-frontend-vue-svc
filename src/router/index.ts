import PageView from "@/views/PageView.vue";
import { createRouter, createWebHistory } from "vue-router";

export function createCustomRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/:pathMatch(.*)*",
        name: "PageView",
        component: PageView,
      },
    ],
    scrollBehavior() {
      return { top: 0 };
    },
  });
}
