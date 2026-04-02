export interface ProcessHealth {
  id: string;
  name: string;
  complianceRate: number;
  openIssues: number;
}

export interface DashboardOverview {
  siteName: string;
  verifiedChecks: number;
  delayedChecks: number;
  cloudSyncRate: number;
  processes: ProcessHealth[];
}
