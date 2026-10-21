<script setup lang="ts">
import { computed } from "vue";
import JobCard from "@/components/content/JobCard.vue";
import JobsEmptyState from "@/components/content/JobsEmptyState.vue";
import JobsErrorState from "@/components/content/JobsErrorState.vue";
import JobsPager from "@/components/content/JobsPager.vue";
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
    <div class="section-heading">
      <div>
        <h2 id="jobs-heading"><span>Aggregator results</span></h2>
      </div>
      <p
        v-if="collecting"
        class="result-count result-count--collecting"
        aria-live="polite"
      >
        <Spinner :size="12" />
        Collecting new listings…
      </p>
      <p v-else-if="!error" class="result-count" aria-live="polite">
        {{ resultLabel }}
      </p>
    </div>

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
  width: calc(100% - 48px);
  margin-inline: auto;
  padding-top: 67px;
  padding-bottom: 59px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  color: var(--text);
  font-weight: 400;
}

.section-heading h2 span {
  color: var(--color-accent-1);
  font-weight: 800;
}

.result-count {
  padding: 7px 10px;
  border-radius: 20px;
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 600;
}

.result-count--collecting {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.job-list {
  display: grid;
  gap: 11px;
}

.job-list--loading {
  opacity: 0.55;
  transition: opacity 160ms ease;
}

@media (max-width: 680px) {
  .jobs-section {
    width: calc(100% - 36px);
    padding-top: 44px;
    padding-bottom: 42px;
  }

  .section-heading {
    align-items: flex-start;
    gap: 10px;
  }

  .result-count {
    margin-top: 23px;
    white-space: nowrap;
  }
}
</style>
