<template>
  <button class="text-button" type="button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

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
