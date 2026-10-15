<script setup lang="ts">
import FormField from "@/components/ui/FormField.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const model = defineModel<JobListingQuery>({ required: true });

defineEmits<{
  apply: [];
  clear: [];
}>();
</script>

<template>
  <form class="filter-panel" @submit.prevent="$emit('apply')">
    <div class="filter-panel__main">
      <label class="search-field search-field--keyword">
        <span class="search-field__icon" aria-hidden="true">⌕</span>
        <span class="search-field__body">
          <span class="search-field__label">Search <code>q</code></span>
          <input
            v-model="model.q"
            autocomplete="off"
            placeholder="Title, company, description or location"
            type="search"
          />
        </span>
      </label>
      <span class="filter-panel__divider" aria-hidden="true"></span>
      <label class="search-field search-field--location">
        <span
          class="search-field__icon search-field__icon--pin"
          aria-hidden="true"
          >⌖</span
        >
        <span class="search-field__body">
          <span class="search-field__label"
            >Location <code>location</code></span
          >
          <input
            v-model="model.location"
            autocomplete="off"
            placeholder="Exact, e.g. Romania"
            type="search"
          />
        </span>
      </label>
      <button class="filter-apply" type="submit">
        <span>Apply filters</span>
        <span aria-hidden="true">↗</span>
      </button>
    </div>

    <div class="filter-panel__filters">
      <FormField label="Company" name="company">
        <input
          v-model="model.company"
          autocomplete="off"
          placeholder="Exact, e.g. GitLab"
          type="text"
        />
      </FormField>
      <FormField label="Source" name="source">
        <input
          v-model="model.source"
          autocomplete="off"
          placeholder="Exact, e.g. ashby:n8n"
          type="text"
        />
      </FormField>
      <FormField label="Status" name="status">
        <input
          v-model="model.status"
          autocomplete="off"
          placeholder="Exact, e.g. match"
          type="text"
        />
      </FormField>
      <FormField label="Work mode" name="work_mode">
        <input
          v-model="model.work_mode"
          autocomplete="off"
          placeholder="Exact, e.g. remote"
          type="text"
        />
      </FormField>
      <FormField label="Limit" name="limit">
        <input v-model.number="model.limit" max="500" min="1" type="number" />
      </FormField>
      <FormField label="Offset" name="offset">
        <input v-model.number="model.offset" min="0" type="number" />
      </FormField>
      <button class="filter-reset" type="button" @click="$emit('clear')">
        Reset
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(48, 70, 55, 0.07);
  border-radius: 12px;
  background: $color-white;
  box-shadow: 0 14px 42px rgba(37, 52, 44, 0.08);
}

.filter-panel__main {
  display: flex;
  min-height: 56px;
  align-items: center;
  gap: 15px;
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
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.search-field__label {
  color: #3e5146;
  font-size: 11px;
  font-weight: 700;
}

code {
  margin-left: 4px;
  padding: 1px 4px;
  border-radius: 3px;
  background: #f1f4ee;
  color: #6c7b70;
  font-size: 9px;
  font-weight: 500;
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

.filter-panel__divider {
  width: 1px;
  height: 36px;
  background: $color-border;
}

.filter-panel__filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) 92px 92px auto;
  align-items: end;
  gap: 10px;
  padding: 12px 8px 4px;
  border-top: 1px solid $color-border;
}

.filter-reset {
  padding: 8px 6px;
  border: 0;
  background: transparent;
  color: $color-green;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.filter-apply {
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
  transition:
    background 160ms ease,
    transform 160ms ease;
}

.filter-apply:hover {
  transform: translateY(-1px);
  background: $color-green-dark;
}

@media (max-width: 900px) {
  .filter-panel__filters {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .filter-reset {
    justify-self: start;
  }
}

@media (max-width: 680px) {
  .filter-panel {
    padding: 13px;
  }

  .filter-panel__main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .search-field--keyword {
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

  .filter-panel__divider {
    display: none;
  }

  .filter-panel__filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: 3px;
  }

  .filter-apply {
    min-height: 42px;
    justify-self: stretch;
  }
}
</style>
