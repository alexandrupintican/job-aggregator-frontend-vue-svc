<script setup lang="ts">
import JobFilterForm from "@/components/content/JobFilterForm.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const filters = defineModel<JobListingQuery>({ required: true });

defineEmits<{
  apply: [];
  clear: [];
}>();
</script>

<template>
  <section class="job-filters" aria-labelledby="job-filters-heading">
    <div class="job-filters__heading">
      <h2 id="job-filters-heading">Filter results</h2>
      <p>Narrows the collector's latest export. Nothing new is fetched.</p>
    </div>
    <JobFilterForm
      v-model="filters"
      @apply="$emit('apply')"
      @clear="$emit('clear')"
    />
  </section>
</template>

<style lang="scss" scoped>
.job-filters {
  width: calc(100% - 48px);
  margin-inline: auto;
  padding-top: 56px;
}

.job-filters__heading {
  margin-bottom: 18px;
}

.job-filters__heading h2 {
  margin: 0;
  color: var(--text);
  font-weight: 400;
}

.job-filters__heading p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

@media (max-width: 680px) {
  .job-filters {
    width: calc(100% - 36px);
    padding-top: 40px;
  }
}
</style>
