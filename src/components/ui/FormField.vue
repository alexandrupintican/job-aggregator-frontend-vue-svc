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
    <span class="form-field__label"
      >{{ label }} <code v-if="name">{{ name }}</code></span
    >
    <slot />
    <span v-if="hint" class="form-field__hint">{{ hint }}</span>
  </label>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.form-field__label {
  color: #3e5146;
  font-size: 11px;
  font-weight: 700;
}

code {
  margin-left: 4px;
  padding: 1px 4px;
  border-radius: 3px;
  background: #f1f4ee;
  color: #6c7b70;
  font-size: 9px;
  font-weight: 500;
}

:slotted(input) {
  width: 100%;
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid $color-border;
  border-radius: 6px;
  background: $color-white;
  color: $color-ink;
  font-size: 11px;
}

:slotted(input)::placeholder {
  color: #929b95;
  opacity: 1;
}

:slotted(input:focus-visible) {
  border-color: $color-green;
  outline: 0;
}

.form-field__hint {
  color: #929b95;
  font-size: 10px;
}
</style>
