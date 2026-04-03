// User Management 타입 정의

// 사용자 상태 상수
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

// 사용자 역할 타입
export interface Role {
  id: string;
  label: string;
}

// 부서 타입
export interface Department {
  id: string;
  label: string;
}

// 사용자 인터페이스
export interface User {
  id: string;
  username: string;
  email: string;
  department: string;
  roles: string[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// 사용자 생성 요청
export interface UserCreateRequest {
  username: string;
  email: string;
  department: string;
  roles: string[];
  status: UserStatus;
}

// 사용자 수정 요청
export interface UserUpdateRequest {
  username: string;
  email: string;
  department: string;
  roles: string[];
  status: UserStatus;
}

// 사용자 목록 응답
export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
  };
  timestamp: string;
}

// 사용자 상세 응답
export interface UserDetailResponse {
  success: boolean;
  data: User;
  timestamp: string;
}

// 마스터 데이터 응답 (부서, 역할)
export interface MasterDataResponse {
  success: boolean;
  data: {
    departments: Department[];
    roles: Role[];
    statuses: Array<{ id: UserStatus; label: string }>;
  };
  timestamp: string;
}

// 일반 응답
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 사용자 목록 조회 파라미터
export interface UserListParams extends PaginationParams {
  search?: string;
  department?: string;
  role?: string;
  status?: UserStatus;
}

// 사용자 관리 필터 상태
export interface UserFilterState {
  search: string;
  department: string;
  role: string;
  status: UserStatus | '';
}
