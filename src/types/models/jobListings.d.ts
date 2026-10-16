// Shapes returned by the Jobs Listing API (GET /api/jobs). The OpenAPI spec
// types listings as a bare object, so these fields mirror the live payload.
// The Go collector writes empty lists as `null`, so every list may be null.

export type JobListingAssessment = {
  status: string
  matched_terms: string[] | null
  reasons: string[] | null
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
  location_restrictions: string[] | null
  work_mode: string
  /** Raw HTML from the source board. */
  description: string
  compensation: { text: string | null }
  contract_types: string[] | null
  employment_type_raw: string[] | null
  url: string
  source: string
  source_id: string
  source_url: string
  sources: JobListingSource[] | null
  assessment: JobListingAssessment
  /** ISO date string, or Unix seconds for some boards (e.g. Himalayas). */
  published_at: string | number | null
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

/** What the collector matches listings against (`preferences` in GET/PUT /api/config). */
export type CollectorPreferences = {
  /** Matched against the listing title. */
  roles: string[]
  /** Matched against the title and description. */
  technologies: string[]
  required_keywords: string[]
  excluded_keywords: string[]
  /** Empty means any. */
  work_modes: string[]
  /** Empty means any. */
  contract_types: string[]
  /** e.g. `EU`; empty means any country. */
  country_filter: string
  /** `null` means no age limit. */
  posted_within_days: number | null
}

/** GET/PUT /api/config. PUT replaces the whole file, so send every field back. */
export type CollectorConfig = {
  preferences: CollectorPreferences
  collection: Record<string, unknown>
  geocoding?: Record<string, unknown>
  sources_file: string
  database: string
  output_directory: string
}

/** GET /api/collector. `last_run` is the latest run report, or null before any run. */
export type CollectorStatus = {
  running: boolean
  last_run: {
    command?: string
    status?: string
    started_at?: string
    finished_at?: string
    /** Set when the run failed or some sources returned partial results. */
    error?: string
    [key: string]: unknown
  } | null
}
