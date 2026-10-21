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
  width: var(--page-width);
  margin-inline: auto;
  height: 100%;
}
</style>
