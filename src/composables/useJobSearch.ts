import { computed, ref, shallowRef } from 'vue'
import api, { JOBS_ENDPOINT } from '@/api/api'
import JobListingQueryModel from '@/models/JobService/jobListingQueryModel'
import type { JobPageModel } from '@/models/JobService/jobPageModel'
import type { JobListingQuery } from '@/types/models/jobListings'

const DEFAULT_LIMIT = 20

function emptyQuery(): JobListingQuery {
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

export function useJobSearch() {
  // `criteria` is the live form model; a request only goes out on search().
  const criteria = ref<JobListingQuery>(emptyQuery())
  const page = shallowRef<JobPageModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let latestRequest = 0

  const requestPath = computed(
    () => `${JOBS_ENDPOINT}${new JobListingQueryModel(criteria.value).getQueryString()}`,
  )

  async function search() {
    const requestId = ++latestRequest
    loading.value = true
    error.value = null

    try {
      const result = await api.jobService.getJobs(new JobListingQueryModel({ ...criteria.value }))
      if (requestId === latestRequest) {
        page.value = result
      }
    } catch (err) {
      if (requestId === latestRequest) {
        error.value = err instanceof Error ? err.message : 'Unable to load jobs.'
      }
    } finally {
      if (requestId === latestRequest) {
        loading.value = false
      }
    }
  }

  function goToOffset(offset: number) {
    criteria.value = { ...criteria.value, offset: Math.max(0, offset) }
    return search()
  }

  function clearSearch() {
    criteria.value = emptyQuery()
    return search()
  }

  search()

  return {
    criteria,
    page,
    loading,
    error,
    requestPath,
    search,
    goToOffset,
    clearSearch,
  }
}
