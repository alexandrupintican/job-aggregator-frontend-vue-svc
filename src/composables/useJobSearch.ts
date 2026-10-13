import { computed, ref } from 'vue'
import type { Job, JobSearchCriteria } from '@/models/job'
import { jobs } from '@/models/jobs'

const emptyCriteria: JobSearchCriteria = {
  keyword: '',
  location: '',
  arrangement: '',
}

export function useJobSearch(listings: Job[] = jobs) {
  const criteria = ref<JobSearchCriteria>({ ...emptyCriteria })
  const submittedCriteria = ref<JobSearchCriteria>({ ...emptyCriteria })

  const filteredJobs = computed(() => {
    const keyword = submittedCriteria.value.keyword.trim().toLowerCase()
    const location = submittedCriteria.value.location.trim().toLowerCase()
    const arrangement = submittedCriteria.value.arrangement

    return listings.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        ...job.tags,
      ].join(' ').toLowerCase()

      return (
        (!keyword || searchableText.includes(keyword)) &&
        (!location || job.location.toLowerCase().includes(location)) &&
        (!arrangement || job.arrangement === arrangement)
      )
    })
  })

  function search() {
    submittedCriteria.value = { ...criteria.value }
  }

  function clearSearch() {
    criteria.value = { ...emptyCriteria }
    submittedCriteria.value = { ...emptyCriteria }
  }

  return {
    criteria,
    filteredJobs,
    search,
    clearSearch,
  }
}
