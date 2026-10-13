import type { JobListingQuery } from "@/types/models/jobListings";

export default class JobListingQueryModel {
  constructor(private readonly data: JobListingQuery = {}) {}

  getLimit(): number | undefined {
    return this.data.limit;
  }

  getOffset(): number | undefined {
    return this.data.offset;
  }

  getStatus(): string | undefined {
    return this.data.status;
  }

  getSource(): string | undefined {
    return this.data.source;
  }

  getCompany(): string | undefined {
    return this.data.company;
  }

  getLocation(): string | undefined {
    return this.data.location;
  }

  getWorkMode(): string | undefined {
    return this.data.work_mode;
  }

  getQ(): string | undefined {
    return this.data.q;
  }

  /** Query string for GET /api/jobs, e.g. `?limit=20&q=vue`. Empty values are skipped. */
  getQueryString(): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(this.data)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }

    const search = params.toString();
    return search ? `?${search}` : "";
  }
}
