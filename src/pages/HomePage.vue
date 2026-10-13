<script setup lang="ts">
import ClosingSection from '@/components/sections/ClosingSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import JobsSection from '@/components/sections/JobsSection.vue'
import { useJobSearch } from '@/composables/useJobSearch'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { criteria, filteredJobs, search, clearSearch } = useJobSearch()
</script>

<template>
  <DefaultLayout>
    <HeroSection v-model="criteria" @search="search" @clear="clearSearch" />
    <JobsSection :jobs="filteredJobs" @clear="clearSearch" />
    <ClosingSection />
  </DefaultLayout>
</template>
