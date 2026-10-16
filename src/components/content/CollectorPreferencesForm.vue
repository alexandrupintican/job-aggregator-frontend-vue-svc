<script setup lang="ts">
import { computed } from "vue";
import FormField from "@/components/ui/FormField.vue";
import ListField from "@/components/ui/ListField.vue";
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
  if (props.saved) return "Saved. Run the collector to apply it to the results.";
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
  <form class="preferences-form" @submit.prevent="$emit('save')">
    <div class="preferences-form__header">
      <h2>Collector preferences</h2>
      <p>
        What the collector looks for. Saved to the server and used on its next
        run.
      </p>
    </div>

    <div class="preferences-form__grid">
      <ListField
        v-model="model.roles"
        label="Roles"
        name="roles"
        placeholder="e.g. Developer, Engineer"
      />
      <ListField
        v-model="model.technologies"
        label="Technologies"
        name="technologies"
        placeholder="e.g. Vue, TypeScript"
      />
      <ListField
        v-model="model.required_keywords"
        label="Required keywords"
        name="required_keywords"
        placeholder="Every listing must mention these"
      />
      <ListField
        v-model="model.excluded_keywords"
        label="Excluded keywords"
        name="excluded_keywords"
        placeholder="e.g. Senior, Lead"
      />
      <ListField
        v-model="model.work_modes"
        label="Work modes"
        name="work_modes"
        placeholder="Any, or e.g. remote, hybrid"
      />
      <ListField
        v-model="model.contract_types"
        label="Contract types"
        name="contract_types"
        placeholder="Any, or e.g. full-time"
      />
      <FormField label="Country" name="country_filter">
        <input
          v-model.trim="model.country_filter"
          autocomplete="off"
          placeholder="Any, or e.g. EU"
          type="text"
        />
      </FormField>
      <FormField label="Posted within days" name="posted_within_days">
        <input
          v-model="postedWithinDays"
          min="1"
          placeholder="No limit"
          type="number"
        />
      </FormField>
    </div>

    <div class="preferences-form__actions">
      <p
        v-if="status"
        class="preferences-form__status"
        :class="tone && `preferences-form__status--${tone}`"
        role="status"
      >
        <Spinner v-if="running && !error" />
        <span>{{ status }}</span>
      </p>
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
        Revert
      </button>
      <button
        class="preferences-form__save"
        :disabled="saving || running"
        type="submit"
      >
        <span>{{ saving ? "Saving…" : "Save preferences" }}</span>
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.preferences-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(48, 70, 55, 0.07);
  border-radius: 12px;
  background: $color-white;
  box-shadow: 0 14px 42px rgba(37, 52, 44, 0.08);
}

.preferences-form__header h2 {
  margin: 0;
  color: $color-green-dark;
  font-family: $font-display;
  font-size: 26px;
  font-weight: 400;
  letter-spacing: -0.5px;
}

.preferences-form__header p {
  margin: 6px 0 0;
  color: #68766d;
  font-size: 12px;
}

.preferences-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.preferences-form__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid $color-border;
}

.preferences-form__status {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: $color-green;
  font-size: 11px;
}

.preferences-form__status--error {
  color: #b54a3c;
}

.preferences-form__status--warning {
  color: #9a6b1f;
}

.preferences-form__revert {
  padding: 8px 6px;
  border: 0;
  background: transparent;
  color: $color-green;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.preferences-form__run {
  min-height: 44px;
  padding: 0 15px;
  border: 1px solid $color-green;
  border-radius: 7px;
  background: transparent;
  color: $color-green;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 160ms ease;
}

.preferences-form__run:hover:not(:disabled) {
  background: #eef3ea;
}

.preferences-form__save {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 18px;
  padding: 0 17px;
  border: 0;
  border-radius: 7px;
  background: $color-green;
  color: $color-white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 160ms ease;
}

.preferences-form__save:hover:not(:disabled) {
  transform: translateY(-1px);
  background: $color-green-dark;
}

.preferences-form__save:disabled,
.preferences-form__run:disabled,
.preferences-form__revert:disabled {
  cursor: wait;
  opacity: 0.6;
}

@media (max-width: 680px) {
  .preferences-form {
    padding: 14px;
  }

  .preferences-form__grid {
    grid-template-columns: 1fr;
  }

  .preferences-form__actions {
    flex-wrap: wrap;
  }

  .preferences-form__status {
    flex-basis: 100%;
  }

  .preferences-form__save {
    flex: 1;
    justify-content: center;
  }
}
</style>
