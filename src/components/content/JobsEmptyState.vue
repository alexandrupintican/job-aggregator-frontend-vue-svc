<script setup lang="ts">
defineEmits<{
  clear: []
}>()
</script>

<template>
  <div class="empty-state">
    <span class="empty-state__icon" aria-hidden="true">⌕</span>
    <h3>No matches just yet</h3>
    <p>Try another keyword or location. The right opportunity might be one search away.</p>
    <button class="text-button" type="button" @click="$emit('clear')">Clear your search</button>
  </div>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.empty-state {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px dashed #d7ddd5;
  border-radius: 10px;
  text-align: center;
}

.empty-state__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #edf1e9;
  color: $color-green;
  font-size: 27px;
}

.empty-state h3 {
  margin: 14px 0 4px;
  font-family: $font-display;
  font-size: 22px;
  font-weight: 400;
}

.empty-state p {
  max-width: 360px;
  margin: 0;
  color: $color-muted;
  font-size: 12px;
  line-height: 1.6;
}

.text-button {
  margin-top: 15px;
  padding: 6px;
  border: 0;
  background: transparent;
  color: $color-green;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}
</style>
