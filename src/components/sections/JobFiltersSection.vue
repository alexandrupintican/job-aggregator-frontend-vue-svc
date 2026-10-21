<script setup lang="ts">
import JobFilterForm from "@/components/content/JobFilterForm.vue";
import SectionHeading from "@/components/ui/SectionHeading.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const filters = defineModel<JobListingQuery>({ required: true });

defineEmits<{
  apply: [];
  clear: [];
}>();
</script>

<template>
  <section class="job-filters" aria-labelledby="job-filters-heading">
    <SectionHeading
      id="job-filters-heading"
      class="job-filters__heading"
      title="Filter results"
      description="Narrows the collector's latest export. Nothing new is fetched."
    />
    <JobFilterForm
      v-model="filters"
      @apply="$emit('apply')"
      @clear="$emit('clear')"
    />
  </section>
</template>

<style lang="scss" scoped>
.job-filters {
  width: var(--page-width);
  margin-inline: auto;
  padding-top: var(--section-spacing);
}

.job-filters__heading {
  margin-bottom: var(--space-4);
}
</style>
