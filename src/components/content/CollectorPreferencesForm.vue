<script setup lang="ts">
import { computed } from "vue";
import FormField from "@/components/ui/FormField.vue";
import ListField from "@/components/ui/ListField.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
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
    <div class="preferences-form__header col--12">
      <h2>Collector preferences</h2>
      <p>
        What the collector looks for. Saved to the server and used on its next
        run. Every field must be comma separated.
      </p>
    </div>

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
        <button
          v-if="saved && !running"
          class="preferences-form__run"
          :disabled="saving || starting"
          type="button"
          @click="$emit('run')"
        >
          {{ starting ? "Starting…" : "Run collector" }}
        </button>
        <button
          class="preferences-form__revert"
          :disabled="saving || running"
          type="button"
          @click="$emit('reload')"
        >
          <p>Revert</p>
        </button>
        <PrimaryButton
          class="preferences-form__save"
          :disabled="saving || running"
          type="submit"
        >
          {{ saving ? "Saving…" : "Save preferences" }}
        </PrimaryButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.preferences-form {
  align-items: end;
  margin: 0;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: 0 14px 42px rgba(0, 0, 0, 0.35);
}

.preferences-form__header h2 {
  margin: 0;
  color: var(--text);
  font-weight: 400;
}

.preferences-form__header p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

.preferences-form__footer {
  display: grid;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.preferences-form__status {
  color: var(--color-accent-1);
}

.preferences-form__status .spinner {
  margin-right: 8px;
}

.preferences-form__status--error {
  color: #e08a9a;
}

.preferences-form__status--warning {
  color: #e0b46a;
}

.preferences-form__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.preferences-form__revert {
  padding: 8px 6px;
  border: 0;
  background: transparent;
  color: var(--color-accent-1);
  font-weight: 650;
  cursor: pointer;
}

.preferences-form__run {
  min-height: 44px;
  padding: 0 15px;
  border: 1px solid var(--color-accent-1);
  border-radius: 7px;
  background: transparent;
  color: var(--color-accent-1);
  font-weight: 600;
  cursor: pointer;
  transition: background 160ms ease;
}

.preferences-form__run:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-accent-1) 15%, transparent);
}

.preferences-form__run:disabled,
.preferences-form__revert:disabled {
  cursor: wait;
  opacity: 0.6;
}

@media (max-width: 680px) {
  .preferences-form {
    padding: 14px;
  }

  .preferences-form__save {
    flex: 1;
  }
}
</style>
