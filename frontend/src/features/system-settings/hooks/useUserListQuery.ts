import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getUserList } from '../api/userManagementApi';
import type {
  UserListResponse,
  UserListParams,
  UserStatus,
} from '../types/userManagement';

// Query key factory
export const userListQueryKeys = {
  all: ['userList'] as const,
  lists: () => [...userListQueryKeys.all, 'list'] as const,
  list: (params: UserListParams) =>
    [...userListQueryKeys.lists(), params] as const,
};

interface UseUserListQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: UserStatus | '';
  enabled?: boolean;
}

/**
 * GET /api/system/users 쿼리 래퍼
 * 페이징 + 필터링 파라미터 전달
 */
export function useUserListQuery(
  options: UseUserListQueryOptions = {},
): UseQueryResult<UserListResponse, Error> {
  const {
    page = 1,
    pageSize = 10,
    search = '',
    department = '',
    role = '',
    status = '',
    enabled = true,
  } = options;

  const params: UserListParams = {
    page,
    pageSize,
    ...(search && { search }),
    ...(department && { department }),
    ...(role && { role }),
    ...(status ? { status } : {}),
  };

  return useQuery({
    queryKey: userListQueryKeys.list(params),
    queryFn: () => getUserList(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
  });
}
