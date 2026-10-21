<script setup lang="ts">
import TextButton from '@/components/ui/TextButton.vue'

withDefaults(
  defineProps<{
    message: string
    title?: string
  }>(),
  { title: "Couldn't load jobs" },
)

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <span class="error-state__icon" aria-hidden="true">!</span>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <TextButton @click="$emit('retry')">Try again</TextButton>
  </div>
</template>

<style lang="scss" scoped>
.error-state {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px dashed rgba(224, 138, 154, 0.4);
  border-radius: 10px;
  text-align: center;
}

.error-state__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: rgba(224, 138, 154, 0.15);
  color: #e08a9a;
}

.error-state h2 {
  margin: 14px 0 4px;
  font-weight: 400;
}

.error-state p {
  max-width: 360px;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
