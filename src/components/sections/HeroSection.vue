<script setup lang="ts">
import CollectorPreferencesForm from "@/components/content/CollectorPreferencesForm.vue";
import JobsErrorState from "@/components/content/JobsErrorState.vue";
import type { CollectorPreferences } from "@/types/models/jobListings";

// Null until the config has loaded.
const preferences = defineModel<CollectorPreferences | null>({
  required: true,
});

defineProps<{
  loading: boolean;
  saving: boolean;
  saved: boolean;
  starting: boolean;
  running: boolean;
  runFinished: boolean;
  runWarning: string | null;
  error: string | null;
}>();

defineEmits<{
  save: [];
  reload: [];
  run: [];
}>();
</script>

<template>
  <section class="hero" :aria-busy="loading">
    <div class="hero__inner">
      <CollectorPreferencesForm
        v-if="preferences"
        v-model="preferences"
        :error="error"
        :saved="saved"
        :saving="saving"
        :starting="starting"
        :running="running"
        :run-finished="runFinished"
        :run-warning="runWarning"
        @reload="$emit('reload')"
        @run="$emit('run')"
        @save="$emit('save')"
      />
      <JobsErrorState
        v-else-if="error"
        :message="error"
        title="Couldn't load collector preferences"
        @retry="$emit('reload')"
      />
      <p v-else class="hero__loading">Loading collector preferences…</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 300px;
  padding: 64px 24px 48px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-accent-1) 18%, var(--background)),
    color-mix(in srgb, var(--color-accent-2) 18%, var(--background))
  );
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: min(100%, 1280px);
  margin-inline: auto;
  animation: rise-in 550ms ease both;
}

.hero__loading {
  margin: 0;
  color: var(--text-muted);
  text-align: center;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
}
</style>
