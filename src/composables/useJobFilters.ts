import { computed, ref, shallowRef } from 'vue'
import api, { JOBS_ENDPOINT } from '@/api/api'
import JobListingQueryModel from '@/models/JobService/jobListingQueryModel'
import { JobPageModel } from '@/models/JobService/jobPageModel'
import type { JobListingQuery, JobPage } from '@/types/models/jobListings'
import { getApiErrorMessage } from '@/utils/utils'

const DEFAULT_LIMIT = 20

function emptyFilters(): JobListingQuery {
  return {
    q: '',
    location: '',
    company: '',
    source: '',
    status: '',
    work_mode: '',
    limit: DEFAULT_LIMIT,
    offset: 0,
  }
}

/**
 * Filters the collector's latest export (GET /api/jobs). It doesn't fetch new
 * listings; changing what gets collected is `useCollectorConfig`'s job.
 */
export function useJobFilters() {
  // `filters` is the live form model; a request only goes out on applyFilters().
  const filters = ref<JobListingQuery>(emptyFilters())
  const page = shallowRef<JobPageModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let latestRequest = 0

  const requestPath = computed(
    () => `${JOBS_ENDPOINT}${new JobListingQueryModel(filters.value).getQueryString()}`,
  )

  async function applyFilters() {
    const requestId = ++latestRequest
    loading.value = true
    error.value = null

    try {
      const result = await api.jobService.getJobs({ ...filters.value })
      if (requestId === latestRequest) {
        page.value = new JobPageModel(result.toJSON() as JobPage)
      }
    } catch (err) {
      if (requestId === latestRequest) {
        error.value = getApiErrorMessage(err, 'Unable to load jobs.')
      }
    } finally {
      if (requestId === latestRequest) {
        loading.value = false
      }
    }
  }

  function goToOffset(offset: number) {
    filters.value = { ...filters.value, offset: Math.max(0, offset) }
    return applyFilters()
  }

  function clearFilters() {
    filters.value = emptyFilters()
    return applyFilters()
  }

  applyFilters()

  return {
    filters,
    page,
    loading,
    error,
    requestPath,
    applyFilters,
    goToOffset,
    clearFilters,
  }
}
