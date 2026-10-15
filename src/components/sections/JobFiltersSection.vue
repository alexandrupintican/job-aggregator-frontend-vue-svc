<script setup lang="ts">
import JobFilterForm from "@/components/content/JobFilterForm.vue";
import RequestPreview from "@/components/content/RequestPreview.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const filters = defineModel<JobListingQuery>({ required: true });

defineProps<{
  requestPath: string;
}>();

defineEmits<{
  apply: [];
  clear: [];
}>();
</script>

<template>
  <section class="job-filters" aria-labelledby="job-filters-heading">
    <div class="job-filters__heading">
      <h2 id="job-filters-heading">Filter <span>results</span></h2>
      <p>Narrows the collector's latest export. Nothing new is fetched.</p>
    </div>
    <JobFilterForm
      v-model="filters"
      @apply="$emit('apply')"
      @clear="$emit('clear')"
    />
    <RequestPreview method="GET" :path="requestPath" />
  </section>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;
@use "@globalStyle/mixins" as *;

.job-filters {
  @include content-width;
  padding-top: 56px;
}

.job-filters__heading {
  margin-bottom: 18px;
}

.job-filters__heading h2 {
  margin: 0;
  color: $color-ink;
  font-family: $font-display;
  font-size: clamp(29px, 4vw, 37px);
  font-weight: 400;
  letter-spacing: -0.8px;
}

.job-filters__heading h2 span {
  color: #8a9e67;
  font-style: italic;
}

.job-filters__heading p {
  margin: 6px 0 0;
  color: #68766d;
  font-size: 12px;
}

@media (max-width: 680px) {
  .job-filters {
    width: min(calc(100% - 36px), $content-width);
    padding-top: 40px;
  }

  .job-filters__heading h2 {
    font-size: 30px;
  }
}
</style>
