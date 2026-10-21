<script setup lang="ts">
import FormField from "@/components/ui/FormField.vue";
import AppButton from "@/components/ui/AppButton.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const model = defineModel<JobListingQuery>({ required: true });

defineEmits<{
  apply: [];
  clear: [];
}>();
</script>

<template>
  <form class="filter-panel" @submit.prevent="$emit('apply')">
    <div class="filter-panel__grid grid">
      <FormField class="col--3 col__sm--3 col__xs--12" label="Search" name="q">
        <input
          v-model="model.q"
          autocomplete="off"
          placeholder="Title, company, description or location"
          type="search"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Location"
        name="location"
      >
        <input
          v-model="model.location"
          autocomplete="off"
          placeholder="Exact, e.g. Romania"
          type="search"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Company"
        name="company"
      >
        <input
          v-model="model.company"
          autocomplete="off"
          placeholder="Exact, e.g. GitLab"
          type="text"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Source"
        name="source"
      >
        <input
          v-model="model.source"
          autocomplete="off"
          placeholder="Exact, e.g. ashby:n8n"
          type="text"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Status"
        name="status"
      >
        <input
          v-model="model.status"
          autocomplete="off"
          placeholder="Exact, e.g. match"
          type="text"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Work mode"
        name="work_mode"
      >
        <input
          v-model="model.work_mode"
          autocomplete="off"
          placeholder="Exact, e.g. remote"
          type="text"
        />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Limit"
        name="limit"
      >
        <input v-model.number="model.limit" max="500" min="1" type="number" />
      </FormField>
      <FormField
        class="col--3 col__sm--3 col__xs--12"
        label="Offset"
        name="offset"
      >
        <input v-model.number="model.offset" min="0" type="number" />
      </FormField>
      <div class="filter-panel__actions col--12 col__md--12">
        <AppButton variant="text" @click="$emit('clear')">Reset</AppButton>
        <AppButton class="filter-apply" type="submit">Apply filters</AppButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.filter-panel {
  padding: var(--panel-padding);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-panel);
}

.filter-panel__grid {
  align-items: end;
  margin: 0;
}

.filter-panel__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .filter-apply {
    flex: 1;
  }
}
</style>
