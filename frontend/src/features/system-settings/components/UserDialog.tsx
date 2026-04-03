import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Box,
  Stack,
  Alert,
} from '@mui/material';
import { useUserManagementStore } from '../store/useUserManagementStore';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../hooks/useUserMutations';
import {
  USER_STATUS,
  type Department,
  type Role,
  type UserStatus,
  type UserCreateRequest,
  type UserUpdateRequest,
} from '../types/userManagement';

interface UserDialogProps {
  departments: Department[];
  roles: Role[];
  onSuccess?: () => void;
}

interface FormData {
  username: string;
  email: string;
  department: string;
  roles: string[];
  status: string;
}

/**
 * 사용자 생성/수정 다이얼로그
 * - MUI Dialog + Form 구성
 * - 입력 필드: username, email, department(select), roles(multi-select), status(select)
 * - 유효성 검사 (필드 필수, 이메일 형식)
 */
export const UserDialog: React.FC<UserDialogProps> = ({
  departments,
  roles,
  onSuccess,
}) => {
  const { isDialogOpen, closeDialog, selectedUser, isCreateMode } =
    useUserManagementStore();
  const { mutate: createUserMutate, isPending: isCreateLoading } =
    useCreateUserMutation({
      onSuccess: () => {
        closeDialog();
        onSuccess?.();
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  const { mutate: updateUserMutate, isPending: isUpdateLoading } =
    useUpdateUserMutation({
      onSuccess: () => {
        closeDialog();
        onSuccess?.();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    email: '',
    department: '',
    roles: [],
    status: USER_STATUS.ACTIVE,
  });

  const [error, setError] = React.useState<string>('');

  // 다이얼로그 열릴 때 폼 초기화
  React.useEffect(() => {
    if (isDialogOpen) {
      if (isCreateMode) {
        setFormData({
          username: '',
          email: '',
          department: '',
          roles: [],
          status: USER_STATUS.ACTIVE,
        });
      } else if (selectedUser) {
        setFormData({
          username: selectedUser.username,
          email: selectedUser.email,
          department: selectedUser.department,
          roles: selectedUser.roles,
          status: selectedUser.status,
        });
      }
      setError('');
    }
  }, [isDialogOpen, isCreateMode, selectedUser]);

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('사용자명은 필수입니다.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('이메일은 필수입니다.');
      return false;
    }
    // 간단한 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력하세요.');
      return false;
    }
    if (!formData.department) {
      setError('부서는 필수입니다.');
      return false;
    }
    if (formData.roles.length === 0) {
      setError('최소 하나의 역할을 선택해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (isCreateMode) {
      const request: UserCreateRequest = {
        username: formData.username,
        email: formData.email,
        department: formData.department,
        roles: formData.roles,
        status: formData.status as UserStatus & string as UserStatus,
      };
      createUserMutate(request);
    } else if (selectedUser) {
      const request: UserUpdateRequest = {
        username: formData.username,
        email: formData.email,
        department: formData.department,
        roles: formData.roles,
        status: formData.status as UserStatus & string as UserStatus,
      };
      updateUserMutate({ userId: selectedUser.id, request });
    }
  };

  const handleClose = () => {
    closeDialog();
    setError('');
  };

  const isLoading = isCreateLoading || isUpdateLoading;

  return (
    <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isCreateMode ? '새 사용자 추가' : '사용자 수정'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* 사용자명 */}
            <TextField
              label="사용자명"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              fullWidth
              required
              disabled={isLoading}
            />

            {/* 이메일 */}
            <TextField
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
              disabled={isLoading}
            />

            {/* 부서 */}
            <FormControl fullWidth required disabled={isLoading}>
              <InputLabel>부서</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                label="부서"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 역할 (다중선택) */}
            <FormControl fullWidth required disabled={isLoading}>
              <InputLabel>역할</InputLabel>
              <Select
                multiple
                value={formData.roles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roles:
                      typeof e.target.value === 'string'
                        ? e.target.value.split(',')
                        : e.target.value,
                  })
                }
                input={<OutlinedInput label="역할" />}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 상태 */}
            <FormControl fullWidth required disabled={isLoading}>
              <InputLabel>상태</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                label="상태"
              >
                <MenuItem value={USER_STATUS.ACTIVE}>활성</MenuItem>
                <MenuItem value={USER_STATUS.INACTIVE}>비활성</MenuItem>
                <MenuItem value={USER_STATUS.SUSPENDED}>정지</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          취소
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? '처리중...' : isCreateMode ? '생성' : '수정'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
