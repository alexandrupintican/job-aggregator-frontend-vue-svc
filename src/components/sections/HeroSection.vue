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
  padding-block: var(--section-spacing);
  background: var(--gradient-accent-subtle);
}

.hero__inner {
  width: var(--page-width);
  margin-inline: auto;
  animation: rise-in var(--duration-enter) ease both;
}

.hero__loading {
  color: var(--text-muted);
  text-align: center;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(var(--space-3));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
