import React from 'react';
import {
  Container,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useUserManagementStore } from '../features/system-settings/store/useUserManagementStore';
import { useUserListQuery } from '../features/system-settings/hooks/useUserListQuery';
import { getMasterData } from '../features/system-settings/api/userManagementApi';
import { UserSearchBar } from '../features/system-settings/components/UserSearchBar';
import { UserTable } from '../features/system-settings/components/UserTable';
import { UserDialog } from '../features/system-settings/components/UserDialog';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import type {
  Department,
  Role,
  UserStatus,
} from '../features/system-settings/types/userManagement';

/**
 * 시스템 설정 → 사용자 관리 페이지
 * 레이아웃:
 * - 상단: 헤더 ("사용자 관리") + 새사용자 추가 버튼
 * - 중단: UserSearchBar (검색/필터)
 * - 하단: UserTable (목록)
 * - 우측 오버레이: UserDialog (생성/수정 다이얼로그)
 */
export function SystemSettingsPage() {
  const { filters, openDialog } = useUserManagementStore();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [masterData, setMasterData] = React.useState<{
    departments: Department[];
    roles: Role[];
  }>({
    departments: [],
    roles: [],
  });
  const [masterDataError, setMasterDataError] = React.useState<string>('');

  // 마스터 데이터 로드
  React.useEffect(() => {
    const loadMasterData = async () => {
      try {
        const response = await getMasterData();
        setMasterData({
          departments: response.data.departments,
          roles: response.data.roles,
        });
      } catch (error) {
        setMasterDataError(
          error instanceof Error ? error.message : '마스터 데이터 로드 실패',
        );
      }
    };

    loadMasterData();
  }, []);

  // 사용자 목록 조회 쿼리
  const {
    data: userListResponse,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchUserList,
  } = useUserListQuery({
    page,
    pageSize,
    search: filters.search,
    department: filters.department,
    role: filters.role,
    status: (filters.status || '') as UserStatus | '',
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  const handleAddUser = () => {
    openDialog('create');
  };

  const handleSearch = async () => {
    setPage(1); // 검색 시 첫 페이지로 이동
    await refetchUserList();
  };

  const handleRefresh = async () => {
    await refetchUserList();
  };

  const users = userListResponse?.data.users ?? [];
  const total = userListResponse?.data.total ?? 0;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      <TopNavigation />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>
                사용자 관리
              </h1>
              <p style={{ margin: 0, color: '#666' }}>
                현장과 관리 조직의 사용자 계정을 역할 기반으로 관리합니다.
              </p>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              sx={{ height: 'fit-content' }}
            >
              + 새 사용자 추가
            </Button>
          </Stack>
        </Box>

        {/* 에러 표시 */}
        {masterDataError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            마스터 데이터 로드 실패: {masterDataError}
          </Alert>
        )}
        {listError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            사용자 목록 조회 실패:{' '}
            {listError instanceof Error ? listError.message : '알 수 없는 오류'}
          </Alert>
        )}

        {/* 검색/필터 바 */}
        <UserSearchBar
          departments={masterData.departments}
          roles={masterData.roles}
          onSearch={handleSearch}
        />

        {/* 로딩 상태 */}
        {isListLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* 사용자 테이블 */
          <UserTable
            users={users}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            departments={masterData.departments}
            roles={masterData.roles}
            onRefresh={handleRefresh}
          />
        )}

        {/* 사용자 생성/수정 다이얼로그 */}
        <UserDialog
          departments={masterData.departments}
          roles={masterData.roles}
          onSuccess={handleRefresh}
        />
      </Container>
    </Box>
  );
}
