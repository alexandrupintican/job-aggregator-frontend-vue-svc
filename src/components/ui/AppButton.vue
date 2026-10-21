<script setup lang="ts">
// The one button for the app. Every variant shares the same height, padding,
// radius and weight, and none has margins: parents space buttons with `gap`.
// Renders a link when `href` is set, otherwise a button. Other attributes
// (target, rel, aria-label, class) fall through to the root element.
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "text";
    href?: string;
    type?: "button" | "submit";
    disabled?: boolean;
    /** Square button holding a single glyph; give it an aria-label. */
    icon?: boolean;
  }>(),
  { variant: "primary", type: "button", disabled: false, icon: false },
);
</script>

<template>
  <a
    v-if="href"
    class="app-button"
    :class="[`app-button--${variant}`, { 'app-button--icon': icon }]"
    :href="href"
  >
    <slot />
  </a>
  <button
    v-else
    class="app-button"
    :class="[`app-button--${variant}`, { 'app-button--icon': icon }]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  box-sizing: border-box;
  min-height: var(--control-height);
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--control-padding-x);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  font-size: inherit;
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.app-button--primary {
  background: var(--color-accent-1);
  color: var(--color-white);
}

.app-button--primary:hover:not(:disabled) {
  transform: translateY(var(--hover-lift));
  background: var(--color-accent-2);
}

.app-button--secondary {
  border-color: var(--color-accent-1);
  color: var(--color-accent-1);
}

.app-button--secondary:hover:not(:disabled) {
  background: var(--color-accent-1-tint);
}

.app-button--text {
  color: var(--color-accent-1);
}

.app-button--text:hover:not(:disabled) {
  text-decoration: underline;
}

.app-button--icon {
  width: var(--control-height);
  padding: 0;
}
</style>
