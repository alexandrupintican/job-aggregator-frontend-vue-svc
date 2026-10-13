<script setup lang="ts">
defineProps<{
  method: string
  path: string
}>()
</script>

<template>
  <p class="request-preview">
    <span class="request-preview__label">Request</span>
    <code class="request-preview__code">
      <span class="request-preview__method">{{ method }}</span>
      {{ path }}
    </code>
  </p>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.request-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 0;
  min-width: 0;
}

.request-preview__label {
  flex: 0 0 auto;
  color: #77837a;
  font-size: 11px;
}

.request-preview__code {
  overflow-x: auto;
  min-width: 0;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
  color: $color-green-dark;
  font-size: 11px;
  white-space: nowrap;
}

.request-preview__method {
  margin-right: 4px;
  font-weight: 700;
}

@media (max-width: 680px) {
  .request-preview {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .request-preview__code {
    max-width: 100%;
  }
}
</style>
