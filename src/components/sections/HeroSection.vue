<script setup lang="ts">
import JobSearchForm from "@/components/content/JobSearchForm.vue";
import RequestPreview from "@/components/content/RequestPreview.vue";
import type { JobListingQuery } from "@/types/models/jobListings";

const criteria = defineModel<JobListingQuery>({ required: true });

defineProps<{
  requestPath: string;
}>();

defineEmits<{
  search: [];
  clear: [];
}>();
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <JobSearchForm
        v-model="criteria"
        @search="$emit('search')"
        @clear="$emit('clear')"
      />
      <RequestPreview method="GET" :path="requestPath" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.hero {
  position: relative;
  min-height: 300px;
  padding: 64px 24px 48px;
  overflow: hidden;
  background: #eaf0e6;
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: min(100%, 920px);
  margin-inline: auto;
  animation: rise-in 550ms ease both;
}

.hero h1 {
  margin: 0;
  color: $color-green-dark;
  font-family: $font-display;
  font-size: clamp(50px, 7vw, 74px);
  font-weight: 400;
  letter-spacing: -2.6px;
  line-height: 0.98;
}

.hero h1 span {
  color: #78924e;
  font-style: italic;
}

.hero__copy {
  max-width: 440px;
  margin: 16px 0 29px;
  color: #68766d;
  font-size: 14px;
  line-height: 1.7;
}

.hero__note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 16px;
  color: #77837a;
  font-size: 11px;
}

.hero__sparkle {
  color: #829b51;
  font-size: 14px;
}

@media (max-width: 900px) {
  .hero__inner {
    width: min(100%, 760px);
  }
}

@media (max-width: 680px) {
  .hero {
    min-height: auto;
    padding: 52px 18px 33px;
  }

  .hero__copy {
    max-width: 360px;
    font-size: 13px;
  }
}
</style>
