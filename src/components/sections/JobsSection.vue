<script setup lang="ts">
import { computed } from 'vue'
import JobCard from '@/components/content/JobCard.vue'
import JobsEmptyState from '@/components/content/JobsEmptyState.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import type { Job } from '@/models/job'

const props = defineProps<{
  jobs: Job[]
}>()

defineEmits<{
  clear: []
}>()

const resultLabel = computed(() => `${props.jobs.length} ${props.jobs.length === 1 ? 'role' : 'roles'}`)
</script>

<template>
  <section class="jobs-section" aria-labelledby="jobs-heading">
    <div class="section-heading">
      <div>
        <SectionEyebrow muted>A good place to begin</SectionEyebrow>
        <h2 id="jobs-heading">Open doors <span>right now</span></h2>
      </div>
      <span class="result-count">{{ resultLabel }}</span>
    </div>

    <div v-if="jobs.length" class="job-list">
      <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>
    <JobsEmptyState v-else @clear="$emit('clear')" />

    <p class="demo-note">These are sample listings to help you explore. Live job feeds are coming soon.</p>
  </section>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;
@use '@globalStyle/mixins' as *;

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

.demo-note {
  margin: 14px 0 0;
  color: #8a948c;
  font-size: 10px;
  text-align: center;
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
