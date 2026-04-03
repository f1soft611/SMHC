import React from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import { useUserManagementStore } from '../store/useUserManagementStore';
import type { Department, Role, UserStatus } from '../types/userManagement';

interface UserSearchBarProps {
  departments: Department[];
  roles: Role[];
  onSearch: () => void;
}

/**
 * 사용자 검색/필터 UI 컴포넌트
 */
export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  departments,
  roles,
  onSearch,
}) => {
  const { filters, setFilters, resetFilters } = useUserManagementStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleDepartmentChange = (e: SelectChangeEvent<string>) => {
    setFilters({ department: e.target.value || '' });
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFilters({ role: e.target.value || '' });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setFilters({ status: (e.target.value as UserStatus | '') || '' });
  };

  const handleReset = () => {
    resetFilters();
    onSearch();
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {/* 검색 입력 */}
          <TextField
            label="검색 (사용자명/이메일)"
            placeholder="검색어를 입력하세요"
            value={filters.search}
            onChange={handleSearchChange}
            size="small"
            fullWidth
          />

          {/* 부서 필터 */}
          <FormControl size="small" fullWidth>
            <InputLabel>부서</InputLabel>
            <Select
              value={filters.department}
              onChange={handleDepartmentChange}
              label="부서"
            >
              <MenuItem value="">전체</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 역할 필터 */}
          <FormControl size="small" fullWidth>
            <InputLabel>역할</InputLabel>
            <Select
              value={filters.role}
              onChange={handleRoleChange}
              label="역할"
            >
              <MenuItem value="">전체</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 상태 필터 */}
          <FormControl size="small" fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              label="상태"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="active">활성</MenuItem>
              <MenuItem value="inactive">비활성</MenuItem>
              <MenuItem value="suspended">정지</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* 버튼 */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="contained" onClick={onSearch}>
            검색
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
