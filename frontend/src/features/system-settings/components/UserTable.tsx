import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useUserManagementStore } from '../store/useUserManagementStore';
import { useDeleteUserMutation } from '../hooks/useUserMutations';
import type { User, Department, Role } from '../types/userManagement';

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  departments: Department[];
  roles: Role[];
  onRefresh?: () => void;
}

/**
 * 사용자 목록 테이블
 * - MUI Table 사용
 * - 컬럼: id, username, email, department, roles, status, actions
 * - 페이지네이션 (기본 10행/페이지)
 * - 행 더블클릭 수정, 버튼 삭제
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  departments,
  roles,
  onRefresh,
}) => {
  const { openDialog } = useUserManagementStore();
  const { mutate: deleteUserMutate } = useDeleteUserMutation({
    onSuccess: () => {
      handleDeleteDialogClose();
      onRefresh?.();
    },
    onError: (error) => {
      alert(`삭제 실패: ${error.message}`);
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const getDepartmentLabel = (deptId: string): string => {
    return departments.find((d) => d.id === deptId)?.label || deptId;
  };

  const getRoleLabels = (roleIds: string[]): string => {
    return roleIds
      .map((rId) => roles.find((r) => r.id === rId)?.label || rId)
      .join(', ');
  };

  const getStatusColor = (status: string): 'success' | 'default' | 'error' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'suspended':
        return '정지';
      default:
        return status;
    }
  };

  const handleRowDoubleClick = (user: User) => {
    openDialog('edit', user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUserMutate(userToDelete.id);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI는 0-indexed
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(e.target.value, 10));
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 700 }}>사용자명</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>이메일</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>부서</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>역할</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>상태</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                작업
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  조회된 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  onDoubleClick={() => handleRowDoubleClick(user)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getDepartmentLabel(user.department)}</TableCell>
                  <TableCell>{getRoleLabels(user.roles)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(user.status)}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ justifyContent: 'center' }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog('edit', user);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user);
                        }}
                      >
                        삭제
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page - 1} // MUI는 0-indexed
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>사용자 삭제</DialogTitle>
        <DialogContent>
          사용자 "{userToDelete?.username}"을(를) 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>취소</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
