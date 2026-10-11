export const SCHEDULED_JOBS = ["refresh-connectors", "expire-offers"] as const;

export type ScheduledJobId = (typeof SCHEDULED_JOBS)[number];

export function listScheduledJobs(): readonly ScheduledJobId[] {
  return SCHEDULED_JOBS;
}
