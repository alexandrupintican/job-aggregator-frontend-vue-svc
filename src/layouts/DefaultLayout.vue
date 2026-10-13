<script setup lang="ts">
import AppFooter from "@/components/footer/AppFooter.vue";
import AppHeader from "@/components/header/AppHeader.vue";
</script>

<template>
  <div class="app-shell">
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-shell {
  overflow: hidden;
}
</style>
