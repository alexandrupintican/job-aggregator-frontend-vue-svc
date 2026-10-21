<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import StateMessage from '@/components/ui/StateMessage.vue'

defineEmits<{
  clear: []
}>()
</script>

<template>
  <StateMessage icon="⌕" title="No matches just yet">
    No listings in the latest export match these filters. Loosen them, or change the collector preferences above.
    <template #action>
      <AppButton variant="text" @click="$emit('clear')">Clear filters</AppButton>
    </template>
  </StateMessage>
</template>
