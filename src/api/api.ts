import { JobExtractorClient } from "@/client/job-aggregator-svc";
import JobListingQueryModel from "@/models/JobService/jobListingQueryModel";
import { JobPageModel } from "@/models/JobService/jobPageModel";
import type { JobPage } from "@/types/models/jobListings";
import { getEnvVariable } from "@/utils/utils";

export const JOBS_ENDPOINT = "/api/jobs";

/** The client appends empty strings as `param=`; drop them like the request preview does. */
function optional(value: string | undefined): string | undefined {
  return value || undefined;
}

// Shared by every service client. Wrapped so `fetch` is never called detached from `window` ("Illegal invocation").
const http = {
  fetch: (url: RequestInfo, init?: RequestInit) => globalThis.fetch(url, init),
};

function createJobService() {
  const client = new JobExtractorClient(getEnvVariable("VITE_API_URL"), http);

  const jobService = {
    getJobs: async (query: JobListingQueryModel): Promise<JobPageModel> => {
      const result = await client.jobs(
        query.getLimit(),
        query.getOffset(),
        optional(query.getStatus()),
        optional(query.getSource()),
        optional(query.getCompany()),
        optional(query.getLocation()),
        optional(query.getWorkMode()),
        optional(query.getQ()),
      );
      return new JobPageModel(result.toJSON() as JobPage);
    },
  };
  return jobService;
}

export default {
  jobService: createJobService(),
};
