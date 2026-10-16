import type { JobListing } from "@/types/models/jobListings";
import { JobListingAssessmentModel } from "@/models/JobService/jobListingAssessmentModel";
import { JobListingSourceModel } from "@/models/JobService/jobListingSourceModel";

/** Accepts ISO strings and Unix timestamps in seconds; both appear in `published_at`. */
function toDate(value: string | number | null): Date | null {
  if (value === null || value === "") return null;
  return new Date(typeof value === "number" ? value * 1000 : value);
}

export class JobListingModel {
  private readonly _sources: readonly JobListingSourceModel[];
  private readonly _assessment: JobListingAssessmentModel;

  constructor(private readonly data: JobListing) {
    this._sources = (data.sources ?? []).map(
      (source) => new JobListingSourceModel(source),
    );
    this._assessment = new JobListingAssessmentModel(data.assessment);
  }

  /** Unique per source board, so it is safe to use as a list key. */
  getId(): string {
    return `${this.data.source}:${this.data.source_id}`;
  }

  getTitle(): string {
    return this.data.title;
  }

  getCompany(): string {
    return this.data.company;
  }

  getLocation(): string {
    return this.data.location;
  }

  getLocationRestrictions(): readonly string[] {
    return this.data.location_restrictions ?? [];
  }

  getWorkMode(): string {
    return this.data.work_mode;
  }

  /** Raw HTML from the source board. */
  getDescription(): string {
    return this.data.description;
  }

  getCompensation(): string | null {
    return this.data.compensation.text;
  }

  getContractTypes(): readonly string[] {
    return this.data.contract_types ?? [];
  }

  getEmploymentTypes(): readonly string[] {
    return this.data.employment_type_raw ?? [];
  }

  getUrl(): string {
    return this.data.url;
  }

  getSource(): string {
    return this.data.source;
  }

  getSourceId(): string {
    return this.data.source_id;
  }

  getSourceUrl(): string {
    return this.data.source_url;
  }

  getSources(): readonly JobListingSourceModel[] {
    return this._sources;
  }

  getAssessment(): JobListingAssessmentModel {
    return this._assessment;
  }

  getPublishedAt(): Date | null {
    return toDate(this.data.published_at);
  }

  getFirstSeen(): Date {
    return new Date(this.data.first_seen);
  }

  getLastSeen(): Date {
    return new Date(this.data.last_seen);
  }
}
