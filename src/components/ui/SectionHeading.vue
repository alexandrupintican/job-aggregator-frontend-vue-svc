<script setup lang="ts">
defineProps<{
  /** Id for the h2, so a section can point aria-labelledby at it. */
  id?: string;
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div class="section-heading">
    <div class="section-heading__text">
      <h2 :id="id">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
}

.section-heading h2 {
  margin: 0;
  color: var(--text);
  font-weight: var(--font-weight-regular);
}

.section-heading p {
  margin-top: var(--space-1);
  color: var(--text-muted);
}
</style>
