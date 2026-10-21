<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import StateMessage from '@/components/ui/StateMessage.vue'

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
  <StateMessage icon="!" :title="title" tone="danger" role="alert">
    {{ message }}
    <template #action>
      <AppButton variant="text" @click="$emit('retry')">Try again</AppButton>
    </template>
  </StateMessage>
</template>
