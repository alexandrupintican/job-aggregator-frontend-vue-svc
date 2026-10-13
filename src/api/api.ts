import JobListingQueryModel from "@/models/JobService/jobListingQueryModel";
import { JobPageModel } from "@/models/JobService/jobPageModel";
import { JobPage } from "@/types/models/jobListings";
import { getEnvVariable } from "@/utils/utils";

export const JOBS_ENDPOINT = "/api/jobs";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(
    `${getEnvVariable("VITE_API_URL")}${path}`,
    init,
  );

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function runRequest<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint);
}

function createJobService() {
  const jobService = {
    getJobs: async (query: JobListingQueryModel): Promise<JobPageModel> =>
      new JobPageModel(
        await runRequest<JobPage>(`${JOBS_ENDPOINT}${query.getQueryString()}`),
      ),
  };
  return jobService;
}

export default {
  jobService: createJobService(),
};
