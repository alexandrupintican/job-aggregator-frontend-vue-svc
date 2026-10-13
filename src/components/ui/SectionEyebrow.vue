<script setup lang="ts">
withDefaults(
  defineProps<{
    dot?: boolean;
    muted?: boolean;
  }>(),
  { dot: false, muted: false },
);
</script>

<template>
  <p class="eyebrow" :class="{ 'eyebrow--muted': muted }">
    <span v-if="dot" class="eyebrow__dot"></span>
    <slot />
  </p>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 17px;
  color: $color-green;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.05px;
  text-transform: uppercase;
}

.eyebrow__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94b84a;
}

.eyebrow--muted {
  margin-bottom: 8px;
  color: #879188;
  font-size: 10px;
}
</style>
