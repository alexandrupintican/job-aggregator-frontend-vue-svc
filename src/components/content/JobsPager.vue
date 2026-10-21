<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

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
    <AppButton
      variant="secondary"
      :disabled="disabled || !hasPrevious"
      @click="$emit('change', offset - limit)"
    >
      <span aria-hidden="true">←</span> Previous
    </AppButton>
    <p class="jobs-pager__range">{{ rangeLabel }}</p>
    <AppButton
      variant="secondary"
      :disabled="disabled || !hasNext"
      @click="$emit('change', offset + limit)"
    >
      Next <span aria-hidden="true">→</span>
    </AppButton>
  </nav>
</template>

<style lang="scss" scoped>
.jobs-pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.jobs-pager__range {
  color: var(--text-muted);
  font-weight: var(--font-weight-semibold);
}
</style>
