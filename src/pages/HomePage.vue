<script setup lang="ts">
import HeroSection from "@/components/sections/HeroSection.vue";
import JobsSection from "@/components/sections/JobsSection.vue";
import { useJobSearch } from "@/composables/useJobSearch";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const {
  criteria,
  page,
  loading,
  error,
  requestPath,
  search,
  goToOffset,
  clearSearch,
} = useJobSearch();
</script>

<template>
  <DefaultLayout>
    <HeroSection
      v-model="criteria"
      :request-path="requestPath"
      @search="search"
      @clear="clearSearch"
    />
    <JobsSection
      :error="error"
      :loading="loading"
      :page="page"
      @clear="clearSearch"
      @page="goToOffset"
      @retry="search"
    />
  </DefaultLayout>
</template>
