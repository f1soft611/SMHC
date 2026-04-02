import { apiClient } from '../../../util/axios';
import type { DashboardOverview } from '../types/overview';

export async function fetchOverview(
  siteId: string,
): Promise<DashboardOverview> {
  const { data } = await apiClient.get<DashboardOverview>('/haccp/overview', {
    params: { siteId },
  });

  return data;
}
