<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: "neutral" | "accent" | "success" | "warning";
  }>(),
  { tone: "neutral" },
);
</script>

<template>
  <span class="chip" :class="`chip--${tone}`"><slot /></span>
</template>

<style lang="scss" scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.chip--neutral {
  background: var(--border);
  color: var(--text-muted);
}

.chip--accent {
  background: var(--color-accent-1-tint);
  color: var(--text);
}

.chip--success {
  background: var(--color-success-tint);
  color: var(--color-success);
}

.chip--warning {
  background: var(--color-warning-tint);
  color: var(--color-warning);
}
</style>
