<script setup lang="ts">
// Renders a link when `href` is set, otherwise a button. Other attributes
// (target, rel, aria-label, class) fall through to the root element.
withDefaults(
  defineProps<{
    href?: string;
    type?: "button" | "submit";
    disabled?: boolean;
  }>(),
  { type: "button", disabled: false },
);
</script>

<template>
  <a v-if="href" class="primary-button" :href="href">
    <slot />
  </a>
  <button v-else class="primary-button" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.primary-button {
  display: inline-block;
  min-height: 44px;
  padding: 0 17px;
  border: 0;
  border-radius: 7px;
  background: var(--color-accent-1);
  color: var(--color-white);
  font-size: inherit;
  font-weight: 600;
  line-height: 44px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 160ms ease;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--color-accent-2);
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.6;
}
</style>
