import type { JobListingAssessment } from "@/types/models/jobListings";

export class JobListingAssessmentModel {
  constructor(private readonly data: JobListingAssessment) {}

  getStatus(): string {
    return this.data.status;
  }

  getMatchedTerms(): readonly string[] {
    return this.data.matched_terms;
  }

  getReasons(): readonly string[] {
    return this.data.reasons;
  }
}
