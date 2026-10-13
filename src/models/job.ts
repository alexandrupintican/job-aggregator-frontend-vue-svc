export type WorkArrangement = 'Remote' | 'Hybrid' | 'On-site'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  arrangement: WorkArrangement
  type: string
  salary: string
  posted: string
  description: string
  tags: string[]
  initials: string
  color: string
}

export interface JobSearchCriteria {
  keyword: string
  location: string
  arrangement: string
}
