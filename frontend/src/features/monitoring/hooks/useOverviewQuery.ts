import { useQuery } from '@tanstack/react-query';
import { fetchOverview } from '../api/overviewApi';

export function useOverviewQuery(siteId: string) {
  return useQuery({
    queryKey: ['overview', siteId],
    queryFn: () => fetchOverview(siteId),
    enabled: siteId.length > 0,
  });
}
