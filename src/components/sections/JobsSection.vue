<script setup lang="ts">
import { computed } from "vue";
import JobCard from "@/components/content/JobCard.vue";
import JobsEmptyState from "@/components/content/JobsEmptyState.vue";
import JobsErrorState from "@/components/content/JobsErrorState.vue";
import JobsPager from "@/components/content/JobsPager.vue";
import type { JobPageModel } from "@/models/JobService/jobPageModel";

const props = defineProps<{
  page: JobPageModel | null;
  loading: boolean;
  error: string | null;
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
      <span v-if="!error" class="result-count" aria-live="polite">{{
        resultLabel
      }}</span>
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
@use "@globalStyle/variables" as *;
@use "@globalStyle/mixins" as *;

.jobs-section {
  @include content-width;
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
  color: $color-ink;
  font-family: $font-display;
  font-size: clamp(29px, 4vw, 37px);
  font-weight: 400;
  letter-spacing: -0.8px;
}

.section-heading h2 span {
  color: #8a9e67;
  font-style: italic;
}

.result-count {
  padding: 7px 10px;
  border-radius: 20px;
  background: #edf0e9;
  color: #65766a;
  font-size: 11px;
  font-weight: 600;
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
    width: min(calc(100% - 36px), $content-width);
    padding-top: 44px;
    padding-bottom: 42px;
  }

  .section-heading {
    align-items: flex-start;
    gap: 10px;
  }

  .section-heading h2 {
    font-size: 30px;
  }

  .result-count {
    margin-top: 23px;
    white-space: nowrap;
  }
}
</style>
