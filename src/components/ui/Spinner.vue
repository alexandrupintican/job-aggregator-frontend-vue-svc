<template>
  <!-- Sized in em so it always matches the text it sits next to. -->
  <span class="spinner" aria-hidden="true"></span>
</template>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  box-sizing: border-box;
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  border: calc(2 * var(--border-width)) solid var(--border);
  border-top-color: var(--color-accent-1);
  border-radius: var(--radius-round);
  animation: spin var(--duration-spin) linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
