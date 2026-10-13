// Shapes returned by the Jobs Listing API (GET /api/jobs). The OpenAPI spec
// types listings as a bare object, so these fields mirror the live payload.

export type JobListingAssessment = {
  status: string
  matched_terms: string[]
  reasons: string[]
}

export type JobListingSource = {
  source: string
  source_id: string
  url: string
}

export type JobListing = {
  title: string
  company: string
  location: string
  location_restrictions: string[]
  work_mode: string
  /** Raw HTML from the source board. */
  description: string
  compensation: { text: string | null }
  contract_types: string[]
  employment_type_raw: string[]
  url: string
  source: string
  source_id: string
  source_url: string
  sources: JobListingSource[]
  assessment: JobListingAssessment
  published_at: string | null
  first_seen: string
  last_seen: string
}

export type JobPage = {
  total: number
  limit: number
  offset: number
  jobs: JobListing[]
}

export type JobListingQuery = {
  /** 1–500, defaults to 100 on the server. */
  limit?: number
  offset?: number
  status?: string
  source?: string
  company?: string
  location?: string
  work_mode?: string
  /** Searches title, company, description and location. */
  q?: string
}

export type HealthStatus = {
  status: string
}
