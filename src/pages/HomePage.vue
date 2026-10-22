<script setup lang="ts">
import ContentHomepage from "@/components/content/ContentHomepage.vue";
import { useHead } from "@unhead/vue";

// TODO: Change meta tags once I care enough
useHead({
  title: "Alexandru Pintican",
  meta: [
    {
      name: "description",
      content: "Search for jobs by various filters. Friends usage only!",
    },
    {
      name: "keywords",
      content: "job aggregator, job search, job listings, remote jobs",
    },
    {
      property: "og:url",
      content: "{{pageUrl}}",
    },
    {
      property: "og:image",
      content: "{{imageUrl}}",
    },
    {
      property: "og:description",
      content: "{{description}}",
    },
    {
      property: "og:title",
      content: "{{pageTitle}}",
    },
    {
      property: "og:site_name",
      content: "{{siteTitle}}",
    },
    {
      property: "og:see_also",
      content: "{{homepageUrl}}",
    },
  ],
  link: [
    {
      rel: "author",
      href: "https://alexandrupintican.com",
    },
    {
      rel: "canonical",
      href: "{{pageUrl}}",
    },
  ],
});
</script>

<template>
  <ContentHomepage />
</template>
