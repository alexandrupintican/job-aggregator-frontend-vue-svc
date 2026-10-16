import { Body, JobExtractorClient, type IBody } from "@/client/job-aggregator-svc";
import { JobPageModel } from "@/models/JobService/jobPageModel";
import type { CollectorConfig, CollectorStatus, JobListingQuery } from "@/types/models/jobListings";
import { JobPage } from "@/client/job-aggregator-svc";
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

/**
 * The OpenAPI spec gives GET /api/config and GET /api/collector no response
 * schema, so the generated methods discard the body. Parse it here instead of
 * editing generated code.
 */
class JobAggregatorClient extends JobExtractorClient {
  protected override processCollector(response: Response): Promise<void> {
    return response.status === 200 ? response.json() : super.processCollector(response);
  }

  protected override processConfigGET(response: Response): Promise<void> {
    return response.status === 200 ? response.json() : super.processConfigGET(response);
  }
}

function createJobService() {
  const client = new JobAggregatorClient(getEnvVariable("VITE_API_URL"), http);

  return {
    getJobs: (query: JobListingQuery): Promise<JobPage> =>
      client.jobs(
        query.limit,
        query.offset,
        query.status,
        query.source,
        query.company,
        query.location,
        query.work_mode,
        query.q,
      ),
    getCollectorStatus: (): Promise<CollectorStatus> =>
      client.collector() as unknown as Promise<CollectorStatus>,
    /** Starts a run in the background (202). Omit `body` for the default `collect` command. */
    runCollector: (body?: IBody): Promise<void> =>
      client.runs(body && new Body(body)),
    getConfig: (): Promise<CollectorConfig> =>
      client.configGET() as unknown as Promise<CollectorConfig>,
    updateConfig: (body: CollectorConfig): Promise<void> => client.configPUT(body),
    getSources: (): Promise<void> => client.sourcesGET(),
    updateSources: (body: any): Promise<void> => client.sourcesPUT(body),
  };
}

export default {
  jobService: createJobService(),
};
