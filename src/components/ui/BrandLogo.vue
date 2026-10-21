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
.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--text);
  font-weight: 650;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
  color: var(--color-white);
  line-height: 1;
}

.brand--compact .brand__mark {
  width: 29px;
  height: 29px;
  border-radius: 9px;
}
</style>
