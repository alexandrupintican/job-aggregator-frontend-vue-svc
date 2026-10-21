import {
  Body,
  JobExtractorClient,
  type IBody,
} from "@/client/job-aggregator-svc";
import { JobPageModel } from "@/models/JobService/jobPageModel";
import type {
  CollectorConfig,
  CollectorStatus,
  JobListingQuery,
} from "@/types/models/jobListings";
import { JobPage } from "@/client/job-aggregator-svc";
import { getEnvVariable } from "@/utils/utils";

export const JOBS_ENDPOINT = "/api/jobs";

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
    return response.status === 200
      ? response.json()
      : super.processCollector(response);
  }

  protected override processConfigGET(response: Response): Promise<void> {
    return response.status === 200
      ? response.json()
      : super.processConfigGET(response);
  }
}

function createJobService() {
  const jobAggregatorClient = new JobAggregatorClient(
    getEnvVariable("VITE_API_URL"),
    http,
  );

  return {
    getJobs: (query: JobListingQuery): Promise<JobPage> =>
      jobAggregatorClient.jobs(
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
      jobAggregatorClient.collector() as unknown as Promise<CollectorStatus>,
    /** Starts a run in the background (202). Omit `body` for the default `collect` command. */
    runCollector: (body?: IBody): Promise<void> =>
      jobAggregatorClient.runs(body && new Body(body)),
    getConfig: (): Promise<CollectorConfig> =>
      jobAggregatorClient.configGET() as unknown as Promise<CollectorConfig>,
    updateConfig: (body: CollectorConfig): Promise<void> =>
      jobAggregatorClient.configPUT(body),
    getSources: (): Promise<void> => jobAggregatorClient.sourcesGET(),
    updateSources: (body: any): Promise<void> =>
      jobAggregatorClient.sourcesPUT(body),
  };
}

export default {
  jobService: createJobService(),
};
