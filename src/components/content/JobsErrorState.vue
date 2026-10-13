<script setup lang="ts">
import TextButton from '@/components/ui/TextButton.vue'

defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <span class="error-state__icon" aria-hidden="true">!</span>
    <h3>Couldn't load jobs</h3>
    <p>{{ message }}</p>
    <TextButton @click="$emit('retry')">Try again</TextButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.error-state {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px dashed #e6c9cf;
  border-radius: 10px;
  text-align: center;
}

.error-state__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #f4e4e7;
  color: #a3606f;
  font-family: $font-display;
  font-size: 24px;
}

.error-state h3 {
  margin: 14px 0 4px;
  font-family: $font-display;
  font-size: 22px;
  font-weight: 400;
}

.error-state p {
  max-width: 360px;
  margin: 0;
  color: $color-muted;
  font-size: 12px;
  line-height: 1.6;
}
</style>
