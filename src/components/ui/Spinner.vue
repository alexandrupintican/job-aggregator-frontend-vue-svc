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
.spinner {
  display: inline-block;
  flex: 0 0 auto;
  border: 2px solid var(--border);
  border-top-color: var(--color-accent-1);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
