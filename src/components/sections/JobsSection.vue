<script setup lang="ts">
import { computed } from "vue";
import JobCard from "@/components/content/JobCard.vue";
import JobsEmptyState from "@/components/content/JobsEmptyState.vue";
import JobsErrorState from "@/components/content/JobsErrorState.vue";
import JobsPager from "@/components/content/JobsPager.vue";
import Chip from "@/components/ui/Chip.vue";
import SectionHeading from "@/components/ui/SectionHeading.vue";
import Spinner from "@/components/ui/Spinner.vue";
import type { JobPageModel } from "@/models/JobService/jobPageModel";

const props = defineProps<{
  page: JobPageModel | null;
  loading: boolean;
  error: string | null;
  /** A collector run is in progress; the results refresh when it finishes. */
  collecting?: boolean;
}>();

defineEmits<{
  clear: [];
  retry: [];
  page: [offset: number];
}>();

const jobs = computed(() => props.page?.getJobs() ?? []);
const total = computed(() => props.page?.getTotal() ?? 0);

const resultLabel = computed(() => {
  if (props.loading) return "Loading…";
  return `${total.value} ${total.value === 1 ? "role" : "roles"}`;
});
</script>

<template>
  <section
    class="jobs-section"
    aria-labelledby="jobs-heading"
    :aria-busy="loading"
  >
    <SectionHeading id="jobs-heading" class="jobs-section__heading">
      <template #title>
        <span class="jobs-section__title">Aggregator results</span>
      </template>
      <Chip v-if="collecting" aria-live="polite">
        <Spinner />
        Collecting new listings…
      </Chip>
      <Chip v-else-if="!error" aria-live="polite">{{ resultLabel }}</Chip>
    </SectionHeading>

    <JobsErrorState v-if="error" :message="error" @retry="$emit('retry')" />
    <template v-else-if="page">
      <div
        v-if="jobs.length"
        class="job-list"
        :class="{ 'job-list--loading': loading }"
      >
        <JobCard v-for="job in jobs" :key="job.getId()" :job="job" />
      </div>
      <JobsEmptyState v-else @clear="$emit('clear')" />
      <JobsPager
        v-if="total"
        :disabled="loading"
        :limit="page.getLimit()"
        :offset="page.getOffset()"
        :shown="jobs.length"
        :total="total"
        @change="$emit('page', $event)"
      />
    </template>
  </section>
</template>

<style lang="scss" scoped>
.jobs-section {
  width: var(--page-width);
  margin-inline: auto;
  padding-block: var(--section-spacing);
}

.jobs-section__heading {
  margin-bottom: var(--space-4);
}

.jobs-section__title {
  color: var(--color-accent-1);
  font-weight: var(--font-weight-black);
}

.job-list {
  display: grid;
  gap: var(--space-3);
}

.job-list--loading {
  opacity: var(--opacity-disabled);
  transition: opacity var(--transition-fast);
}
</style>
