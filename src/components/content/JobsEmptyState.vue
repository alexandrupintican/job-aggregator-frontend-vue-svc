<script setup lang="ts">
import TextButton from '@/components/ui/TextButton.vue'

defineEmits<{
  clear: []
}>()
</script>

<template>
  <div class="empty-state">
    <span class="empty-state__icon" aria-hidden="true">⌕</span>
    <h2>No matches just yet</h2>
    <p>No listings in the latest export match these filters. Loosen them, or change the collector preferences above.</p>
    <TextButton @click="$emit('clear')">Clear filters</TextButton>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px dashed var(--border);
  border-radius: 10px;
  text-align: center;
}

.empty-state__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-accent-1) 18%, transparent);
  color: var(--color-accent-1);
}

.empty-state h2 {
  margin: 14px 0 4px;
  font-weight: 400;
}

.empty-state p {
  max-width: 360px;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
