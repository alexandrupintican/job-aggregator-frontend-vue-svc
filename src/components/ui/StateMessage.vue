<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    /** A single decorative glyph shown above the title. */
    icon: string;
    tone?: "accent" | "danger";
  }>(),
  { tone: "accent" },
);
</script>

<template>
  <div class="state-message" :class="`state-message--${tone}`">
    <span class="state-message__icon" aria-hidden="true">{{ icon }}</span>
    <h2>{{ title }}</h2>
    <p><slot /></p>
    <slot name="action" />
  </div>
</template>

<style lang="scss" scoped>
.state-message {
  display: grid;
  min-height: var(--state-min-height);
  align-content: center;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--panel-padding);
  border: var(--border-width) dashed var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
}

.state-message--danger {
  border-color: var(--color-danger-tint);
}

.state-message__icon {
  display: grid;
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
  place-items: center;
  border-radius: var(--radius-round);
  background: var(--color-accent-1-tint);
  color: var(--color-accent-1);
}

.state-message--danger .state-message__icon {
  background: var(--color-danger-tint);
  color: var(--color-danger);
}

.state-message h2 {
  margin: 0;
  font-weight: var(--font-weight-regular);
}

.state-message p {
  max-width: var(--measure-narrow);
  color: var(--text-muted);
  line-height: var(--line-height-relaxed);
}
</style>
