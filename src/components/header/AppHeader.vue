<script setup lang="ts">
import BrandLogo from '@/components/ui/BrandLogo.vue'
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <BrandLogo mark="j." name="Job Aggregator" aria-label="Job Aggregator home" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;
@use '@globalStyle/mixins' as *;

.site-header {
  position: relative;
  z-index: 2;
  height: 82px;
  background: $color-paper;
}

.site-header__inner {
  @include content-width;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

@media (max-width: 680px) {
  .site-header {
    height: 68px;
  }

  .site-header__inner {
    width: min(calc(100% - 36px), $content-width);
  }
}
</style>
