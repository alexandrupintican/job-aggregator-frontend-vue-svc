<script setup lang="ts">
import { computed } from "vue";
import FormField from "@/components/ui/FormField.vue";
import ListField from "@/components/ui/ListField.vue";
import AppButton from "@/components/ui/AppButton.vue";
import SectionHeading from "@/components/ui/SectionHeading.vue";
import Spinner from "@/components/ui/Spinner.vue";
import type { CollectorPreferences } from "@/types/models/jobListings";

const model = defineModel<CollectorPreferences>({ required: true });

const props = defineProps<{
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

const status = computed(() => {
  if (props.error) return props.error;
  if (props.running) {
    return "Collector is running. Results refresh when it finishes.";
  }
  if (props.runFinished) {
    return props.runWarning
      ? `Collector finished with warnings: ${props.runWarning}. Results refreshed.`
      : "Collector finished. Results refreshed.";
  }
  if (props.saved)
    return "Saved. Run the collector to apply it to the results.";
  return null;
});

const tone = computed(() => {
  if (props.error) return "error";
  if (props.runFinished && props.runWarning && !props.running) return "warning";
  return null;
});

// An empty box means "no age limit", which the collector expects as null.
const postedWithinDays = computed({
  get: () => model.value.posted_within_days ?? "",
  set: (value: number | string) => {
    model.value.posted_within_days = value === "" ? null : Number(value);
  },
});
</script>

<template>
  <form class="preferences-form grid" @submit.prevent="$emit('save')">
    <SectionHeading
      class="col--12"
      title="Collector preferences"
      description="What the collector looks for. Saved to the server and used on its next run. Every field must be comma separated."
    />

    <ListField
      v-model="model.roles"
      class="col--12 col__sm--3"
      label="Roles"
      name="roles"
      placeholder="e.g. Developer, Engineer"
    />
    <ListField
      v-model="model.technologies"
      class="col--12 col__sm--3"
      label="Technologies"
      name="technologies"
      placeholder="e.g. Vue, TypeScript"
    />
    <ListField
      v-model="model.required_keywords"
      class="col--12 col__sm--3"
      label="Required keywords"
      name="required_keywords"
      placeholder="Every listing must mention these"
    />
    <ListField
      v-model="model.excluded_keywords"
      class="col--12 col__sm--3"
      label="Excluded keywords"
      name="excluded_keywords"
      placeholder="e.g. Senior, Lead"
    />
    <ListField
      v-model="model.work_modes"
      class="col--12 col__sm--3"
      label="Work modes"
      name="work_modes"
      placeholder="Any, or e.g. remote, hybrid"
    />
    <ListField
      v-model="model.contract_types"
      class="col--12 col__sm--3"
      label="Contract types"
      name="contract_types"
      placeholder="Any, or e.g. full-time"
    />
    <FormField class="col--12 col__sm--3" label="Country" name="country_filter">
      <input
        v-model.trim="model.country_filter"
        autocomplete="off"
        placeholder="Any, or e.g. EU"
        type="text"
      />
    </FormField>
    <FormField
      class="col--12 col__sm--3"
      label="Posted within days"
      name="posted_within_days"
    >
      <input
        v-model="postedWithinDays"
        min="1"
        placeholder="No limit"
        type="number"
      />
    </FormField>

    <div class="preferences-form__footer col--12">
      <p
        v-if="status"
        class="preferences-form__status"
        :class="tone && `preferences-form__status--${tone}`"
        role="status"
      >
        <Spinner v-if="running && !error" />
        {{ status }}
      </p>
      <div class="preferences-form__actions">
        <AppButton
          v-if="saved && !running"
          variant="secondary"
          :disabled="saving || starting"
          @click="$emit('run')"
        >
          {{ starting ? "Starting…" : "Run collector" }}
        </AppButton>
        <AppButton
          variant="text"
          :disabled="saving || running"
          @click="$emit('reload')"
        >
          Revert
        </AppButton>
        <AppButton
          class="preferences-form__save"
          :disabled="saving || running"
          type="submit"
        >
          {{ saving ? "Saving…" : "Save preferences" }}
        </AppButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.preferences-form {
  align-items: end;
  margin: 0;
  padding: var(--panel-padding);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-panel);
}

.preferences-form__footer {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--border);
}

.preferences-form__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-accent-1);
}

.preferences-form__status--error {
  color: var(--color-danger);
}

.preferences-form__status--warning {
  color: var(--color-warning);
}

.preferences-form__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .preferences-form__save {
    flex: 1;
  }
}
</style>
