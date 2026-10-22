<script setup lang="ts">
import AppHeader from "@/components/header/AppHeader.vue";
import AppFooter from "@/components/footer/AppFooter.vue";
</script>

<template>
  <app-header />
  <main class="content">
    <slot />
  </main>
  <app-footer />
</template>

<style lang="scss" scoped>
.content {
  min-height: var(--content-height);
}
</style>
