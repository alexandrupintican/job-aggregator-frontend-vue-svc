<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  offset: number
  limit: number
  shown: number
  disabled?: boolean
}>()

defineEmits<{
  change: [offset: number]
}>()

const rangeLabel = computed(() =>
  props.shown ? `${props.offset + 1}–${props.offset + props.shown} of ${props.total}` : `0 of ${props.total}`,
)
const hasPrevious = computed(() => props.offset > 0)
const hasNext = computed(() => props.offset + props.shown < props.total)
</script>

<template>
  <nav class="jobs-pager" aria-label="Results pages">
    <button
      class="jobs-pager__button"
      type="button"
      :disabled="disabled || !hasPrevious"
      @click="$emit('change', offset - limit)"
    >
      <span aria-hidden="true">←</span> Previous
    </button>
    <p class="jobs-pager__range">{{ rangeLabel }}</p>
    <button
      class="jobs-pager__button"
      type="button"
      :disabled="disabled || !hasNext"
      @click="$emit('change', offset + limit)"
    >
      Next <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.jobs-pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.jobs-pager__range {
  color: var(--text-muted);
  font-weight: 600;
}

.jobs-pager__button {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface);
  color: var(--color-accent-1);
  font-weight: 650;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.jobs-pager__button:hover:not(:disabled) {
  border-color: var(--color-accent-1);
  background: color-mix(in srgb, var(--color-accent-1) 12%, var(--surface));
}

.jobs-pager__button:disabled {
  color: var(--color-secondary);
  cursor: default;
}
</style>
