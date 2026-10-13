<script setup lang="ts">
import AppHeader from "@/components/header/AppHeader.vue";
import AppFooter from "@/components/footer/AppFooter.vue";
import usePages from "@/composables/usePages";
import { PageAliases } from "@/utils/pages";
import { defineAsyncComponent, ref } from "vue";

// define pages
const Pages = {
  homePage: defineAsyncComponent(() => import("@/pages/HomePage.vue")),
};

// composables
const { pageRef } = usePages();
</script>

<template>
  <app-header />
  <component :is="Pages[pageRef as keyof typeof Pages]"></component>
  <app-footer />
</template>
