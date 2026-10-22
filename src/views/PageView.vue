<script setup lang="ts">
import usePages from "@/composables/usePages";
import { defineAsyncComponent } from "vue";

// define pages
const Pages = {
  homePage: defineAsyncComponent(() => import("@/pages/HomePage.vue")),
};

// composables
const { pageRef } = usePages();
</script>

<template>
  <component :is="Pages[pageRef as keyof typeof Pages]"></component>
</template>
