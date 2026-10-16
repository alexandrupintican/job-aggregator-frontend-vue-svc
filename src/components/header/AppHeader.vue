<script setup lang="ts">
import BrandLogo from "@/components/ui/BrandLogo.vue";
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <BrandLogo
        mark="j."
        name="Job Aggregator"
        aria-label="Job Aggregator home"
      />
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.site-header {
  position: relative;
  z-index: 2;
  height: var(--header-height);
  background: var(--background);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 48px);
  height: 100%;
  margin-inline: auto;
}

@media (max-width: 680px) {
  .site-header__inner {
    width: calc(100% - 36px);
  }
}
</style>
