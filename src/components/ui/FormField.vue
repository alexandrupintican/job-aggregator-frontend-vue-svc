<script setup lang="ts">
defineProps<{
  label: string;
  /** API field name, shown as a code chip next to the label. */
  name?: string;
  hint?: string;
}>();
</script>

<template>
  <label class="form-field">
    <span class="form-field__label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="form-field__hint">{{ hint }}</span>
  </label>
</template>

<style lang="scss" scoped>
.form-field {
  display: grid;
  min-width: 0;
  gap: var(--space-2);
}

.form-field__label {
  color: var(--text);
  font-weight: var(--font-weight-bold);
}

:slotted(input) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: var(--control-height);
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text);
}

:slotted(input)::placeholder {
  color: var(--color-secondary);
  opacity: 1;
}

:slotted(input:focus-visible) {
  border-color: var(--color-accent-1);
  outline: 0;
}

.form-field__hint {
  color: var(--color-secondary);
}
</style>
