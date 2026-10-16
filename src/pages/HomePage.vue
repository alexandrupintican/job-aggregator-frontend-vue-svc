<script setup lang="ts">
import HeroSection from "@/components/sections/HeroSection.vue";
import JobFiltersSection from "@/components/sections/JobFiltersSection.vue";
import JobsSection from "@/components/sections/JobsSection.vue";
import { useCollectorConfig } from "@/composables/useCollectorConfig";
import { useJobFilters } from "@/composables/useJobFilters";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const {
  filters,
  page,
  loading,
  error,
  applyFilters,
  goToOffset,
  clearFilters,
} = useJobFilters();

const {
  preferences,
  loading: configLoading,
  saving: configSaving,
  saved: configSaved,
  starting: collectorStarting,
  running: collectorRunning,
  runFinished: collectorRunFinished,
  runWarning: collectorRunWarning,
  error: configError,
  save: savePreferences,
  reload: reloadPreferences,
  runCollector,
} = useCollectorConfig({
  // The export changed, so the old offset may point past the end.
  onRunFinished: () => goToOffset(0),
});
</script>

<template>
  <DefaultLayout class="content">
    <HeroSection
      v-model="preferences"
      :error="configError"
      :loading="configLoading"
      :saved="configSaved"
      :saving="configSaving"
      :starting="collectorStarting"
      :running="collectorRunning"
      :run-finished="collectorRunFinished"
      :run-warning="collectorRunWarning"
      @reload="reloadPreferences"
      @run="runCollector"
      @save="savePreferences"
    />
    <JobFiltersSection
      v-model="filters"
      @apply="applyFilters"
      @clear="clearFilters"
    />
    <JobsSection
      :collecting="collectorRunning"
      :error="error"
      :loading="loading"
      :page="page"
      @clear="clearFilters"
      @page="goToOffset"
      @retry="applyFilters"
    />
  </DefaultLayout>
</template>

<style lang="scss" scoped>
.content {
  min-height: var(--content-height);
}
</style>
