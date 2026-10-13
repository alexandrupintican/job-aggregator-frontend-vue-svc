import type { JobListingSource } from "@/types/models/jobListings";

export class JobListingSourceModel {
  constructor(private readonly data: JobListingSource) {}

  getSource(): string {
    return this.data.source;
  }

  getSourceId(): string {
    return this.data.source_id;
  }

  getUrl(): string {
    return this.data.url;
  }
}
