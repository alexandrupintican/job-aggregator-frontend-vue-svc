import type { JobPage } from "@/types/models/jobListings";
import { JobListingModel } from "@/models/JobService/jobListing";

export class JobPageModel {
  private readonly _jobs: readonly JobListingModel[];

  constructor(private readonly data: JobPage) {
    this._jobs = data.jobs.map((job) => new JobListingModel(job));
  }

  getTotal(): number {
    return this.data.total;
  }

  getLimit(): number {
    return this.data.limit;
  }

  getOffset(): number {
    return this.data.offset;
  }

  getJobs(): readonly JobListingModel[] {
    return this._jobs;
  }

  getHasMore(): boolean {
    return this.data.offset + this._jobs.length < this.data.total;
  }
}
