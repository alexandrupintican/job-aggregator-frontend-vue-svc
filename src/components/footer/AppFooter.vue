<script setup lang="ts">
import BrandLogo from '@/components/ui/BrandLogo.vue'
</script>

<template>
  <footer id="about" class="site-footer">
    <div class="site-footer__inner">
      <BrandLogo mark="w." name="workfolk" compact />
      <p>Good work is out there. Let's find it.</p>
      <span class="site-footer__copyright">Made for your next chapter · 2025</span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;
@use '@globalStyle/mixins' as *;

.site-footer {
  min-height: 76px;
  background: $color-paper;
}

.site-footer__inner {
  @include content-width;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 100%;
}

.site-footer p,
.site-footer__copyright {
  color: #828e85;
  font-size: 10px;
}

@media (max-width: 680px) {
  .site-footer__inner {
    width: min(calc(100% - 36px), $content-width);
    min-height: 85px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2px 14px;
    padding-block: 12px;
  }

  .site-footer p {
    margin: 0;
  }

  .site-footer__copyright {
    flex-basis: 100%;
    text-align: center;
  }
}
</style>
