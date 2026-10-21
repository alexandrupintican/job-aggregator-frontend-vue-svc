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
  gap: var(--space-2);
  color: var(--text);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--gradient-accent);
  color: var(--color-white);
  line-height: 1;
}

.brand--compact .brand__mark {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
  border-radius: var(--radius-sm);
}
</style>
