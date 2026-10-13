<script setup lang="ts">
withDefaults(
  defineProps<{
    mark: string
    name: string
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <RouterLink class="brand" :class="{ 'brand--compact': compact }" to="/">
    <span class="brand__mark" aria-hidden="true">{{ mark }}</span>
    <span>{{ name }}</span>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: $color-ink;
  font-size: 19px;
  font-weight: 650;
  letter-spacing: -0.8px;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 11px;
  background: $color-green;
  color: $color-white;
  font-family: $font-display;
  font-size: 22px;
  line-height: 1;
  letter-spacing: -2px;
}

.brand--compact {
  font-size: 16px;
}

.brand--compact .brand__mark {
  width: 29px;
  height: 29px;
  border-radius: 9px;
  font-size: 19px;
}
</style>
