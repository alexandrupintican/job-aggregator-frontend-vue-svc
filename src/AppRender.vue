<script setup lang="ts">
import App from "@/App.vue";

defineOptions({
  name: "AppRender",
});
</script>

<template>
  <Suspense>
    <App />
  </Suspense>
</template>
