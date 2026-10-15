<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Diameter in px. */
    size?: number;
  }>(),
  { size: 14 },
);
</script>

<template>
  <span
    class="spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  ></span>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.spinner {
  display: inline-block;
  flex: 0 0 auto;
  border: 2px solid #d7e2d0;
  border-top-color: $color-green;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}
</style>
