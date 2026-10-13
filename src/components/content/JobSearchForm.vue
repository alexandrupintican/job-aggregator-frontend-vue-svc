<script setup lang="ts">
import type { JobSearchCriteria } from '@/models/job'

const model = defineModel<JobSearchCriteria>({ required: true })

defineEmits<{
  search: []
  clear: []
}>()
</script>

<template>
  <form class="search-panel" role="search" @submit.prevent="$emit('search')">
    <label class="search-field search-field--keyword">
      <span class="search-field__icon" aria-hidden="true">⌕</span>
      <span class="search-field__body">
        <span class="search-field__label">What are you looking for?</span>
        <input
          v-model="model.keyword"
          aria-label="Job title, skill, or company"
          autocomplete="off"
          placeholder="Job title, skill, or company"
          type="search"
        />
      </span>
    </label>
    <span class="search-panel__divider" aria-hidden="true"></span>
    <label class="search-field search-field--location">
      <span class="search-field__icon search-field__icon--pin" aria-hidden="true">⌖</span>
      <span class="search-field__body">
        <span class="search-field__label">Where?</span>
        <input
          v-model="model.location"
          aria-label="City, state, or remote"
          autocomplete="off"
          placeholder="City, state, or remote"
          type="search"
        />
      </span>
    </label>
    <label class="arrangement-select">
      <span class="sr-only">Work arrangement</span>
      <select v-model="model.arrangement" aria-label="Work arrangement">
        <option value="">Any setup</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
        <option value="On-site">On-site</option>
      </select>
    </label>
    <button class="search-button" type="submit">
      <span>Find jobs</span>
      <span aria-hidden="true">↗</span>
    </button>
  </form>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.search-panel {
  display: flex;
  min-height: 80px;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border: 1px solid rgba(48, 70, 55, 0.07);
  border-radius: 12px;
  background: $color-white;
  box-shadow: 0 14px 42px rgba(37, 52, 44, 0.08);
}

.search-field {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.search-field--keyword {
  flex: 1.2;
  padding-left: 8px;
}

.search-field--location {
  flex: 1;
}

.search-field__icon {
  align-self: flex-start;
  margin-top: 1px;
  color: $color-green;
  font-size: 26px;
  font-weight: 400;
  line-height: 1;
}

.search-field__icon--pin {
  font-size: 24px;
}

.search-field__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.search-field__label {
  color: #3e5146;
  font-size: 11px;
  font-weight: 700;
}

.search-field input {
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: $color-ink;
  font-size: 12px;
}

.search-field input::placeholder {
  color: #929b95;
  opacity: 1;
}

.search-field input:focus-visible {
  outline: 0;
}

.search-panel__divider {
  width: 1px;
  height: 36px;
  background: $color-border;
}

.arrangement-select {
  flex: 0 0 auto;
}

.arrangement-select select {
  max-width: 110px;
  padding: 11px 20px 11px 8px;
  border: 0;
  background-color: transparent;
  color: #59685e;
  font-size: 11px;
  cursor: pointer;
}

.search-button {
  display: inline-flex;
  min-height: 48px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 0 17px;
  border: 0;
  border-radius: 7px;
  background: $color-green;
  color: $color-white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}

.search-button:hover {
  transform: translateY(-1px);
  background: $color-green-dark;
}

@media (max-width: 680px) {
  .search-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 9px;
    padding: 13px;
  }

  .search-field--keyword {
    grid-column: 1 / -1;
    padding: 0 3px 10px;
    border-bottom: 1px solid $color-border;
  }

  .search-field--location {
    padding-left: 3px;
  }

  .search-field__icon--pin {
    font-size: 22px;
  }

  .search-field__label {
    font-size: 10px;
  }

  .search-field input {
    font-size: 11px;
  }

  .search-panel__divider {
    display: none;
  }

  .arrangement-select {
    grid-column: 1;
  }

  .arrangement-select select {
    max-width: 100%;
    padding: 10px 2px;
    font-size: 11px;
  }

  .search-button {
    grid-column: 2;
    grid-row: 3;
    min-height: 42px;
    justify-self: end;
  }
}
</style>
