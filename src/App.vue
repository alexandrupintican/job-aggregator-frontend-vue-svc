<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import useLayout from "@/composables/useLayout";

const Layouts = {
  defaultLayout: defineAsyncComponent(
    () => import("@/layouts/DefaultLayout.vue"),
  ),
};

const { layoutRef } = useLayout();
</script>

<template>
  <component :is="Layouts[layoutRef as keyof typeof Layouts]">
    <RouterView />
  </component>
</template>
