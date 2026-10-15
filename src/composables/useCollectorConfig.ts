import { onScopeDispose, ref, shallowRef } from "vue";
import api from "@/api/api";
import type {
  CollectorConfig,
  CollectorPreferences,
} from "@/types/models/jobListings";
import { getApiErrorMessage } from "@/utils/utils";

const POLL_INTERVAL_MS = 10000;

function copyPreferences(
  preferences: CollectorPreferences,
): CollectorPreferences {
  return {
    ...preferences,
    roles: [...preferences.roles],
    technologies: [...preferences.technologies],
    required_keywords: [...preferences.required_keywords],
    excluded_keywords: [...preferences.excluded_keywords],
    work_modes: [...preferences.work_modes],
    contract_types: [...preferences.contract_types],
  };
}

type CollectorConfigOptions = {
  /** Called when a collector run this page is watching finishes, e.g. to reload the results. */
  onRunFinished?: () => void;
};

/**
 * Edits the collector's `preferences` (GET/PUT /api/config) and runs the
 * collector. `preferences` is the live form model; nothing is sent until save().
 */
export function useCollectorConfig({
  onRunFinished,
}: CollectorConfigOptions = {}) {
  // Last config read from or saved to the server. PUT replaces the whole file,
  // so save() sends this back with only `preferences` swapped in.
  const config = shallowRef<CollectorConfig | null>(null);
  const preferences = ref<CollectorPreferences | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref<string | null>(null);
  const saved = ref(false);
  const starting = ref(false);
  // True from a successful start until GET /api/collector reports it stopped.
  const running = ref(false);
  const runFinished = ref(false);
  // Set when a finished run reported partial failures; the export still updated.
  const runWarning = ref<string | null>(null);

  let pollTimer: ReturnType<typeof setTimeout> | undefined;

  function stopPolling() {
    clearTimeout(pollTimer);
    pollTimer = undefined;
  }

  function finishRun(warning: string | undefined) {
    stopPolling();
    running.value = false;
    runFinished.value = true;
    runWarning.value = warning ?? null;
    onRunFinished?.();
  }

  async function poll() {
    try {
      const status = await api.jobService.getCollectorStatus();
      if (!running.value) return;
      if (status.running) {
        pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        finishRun(status.last_run?.error);
      }
    } catch (err) {
      stopPolling();
      running.value = false;
      error.value = getApiErrorMessage(err, "Lost track of the collector run.");
    }
  }

  function watchRun() {
    stopPolling();
    running.value = true;
    runFinished.value = false;
    runWarning.value = null;
    pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
  }

  async function load() {
    loading.value = true;
    error.value = null;
    saved.value = false;
    runFinished.value = false;

    try {
      config.value = await api.jobService.getConfig();
      preferences.value = copyPreferences(config.value.preferences);
    } catch (err) {
      error.value = getApiErrorMessage(
        err,
        "Unable to load the collector config.",
      );
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    if (!config.value || !preferences.value) return;

    const next: CollectorConfig = {
      ...config.value,
      preferences: copyPreferences(preferences.value),
    };
    saving.value = true;
    error.value = null;
    saved.value = false;
    runFinished.value = false;

    try {
      await api.jobService.updateConfig(next);
      config.value = next;
      saved.value = true;
    } catch (err) {
      error.value = getApiErrorMessage(
        err,
        "Unable to save the collector config.",
      );
    } finally {
      saving.value = false;
    }
  }

  /** Starts a collector run with the saved config and watches it until it finishes. */
  async function runCollector() {
    starting.value = true;
    error.value = null;

    try {
      await api.jobService.runCollector();
      watchRun();
    } catch (err) {
      error.value = getApiErrorMessage(err, "Unable to start the collector.");
    } finally {
      starting.value = false;
    }
  }

  // Pick up a run that was already going when the page opened.
  async function checkForRunningCollector() {
    try {
      const status = await api.jobService.getCollectorStatus();
      if (status.running && !running.value) watchRun();
    } catch {
      // Status is best-effort here; the form still works without it.
    }
  }

  onScopeDispose(stopPolling);

  load();
  checkForRunningCollector();

  return {
    preferences,
    loading,
    saving,
    error,
    saved,
    starting,
    running,
    runFinished,
    runWarning,
    save,
    runCollector,
    reload: load,
  };
}
