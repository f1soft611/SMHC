import type {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserListResponse,
  UserDetailResponse,
  MasterDataResponse,
  UserListParams,
  ApiResponse,
} from '../types/userManagement';

// 목데이터 저장소 (sessionStorage 기반)
const STORAGE_KEY = 'system-users';

// 초기 목데이터
const initialUsers: User[] = [
  {
    id: 'USER-001',
    username: 'admin',
    email: 'admin@smhc.local',
    department: 'DEPT-003',
    roles: ['ROLE-SYSTEM_ADMIN'],
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'USER-002',
    username: 'manager01',
    email: 'manager01@smhc.local',
    department: 'DEPT-001',
    roles: ['ROLE-AUDITOR'],
    status: 'active',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 'USER-003',
    username: 'operator01',
    email: 'operator01@smhc.local',
    department: 'DEPT-002',
    roles: ['ROLE-USER'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-01T09:30:00Z',
  },
  {
    id: 'USER-004',
    username: 'operator02',
    email: 'operator02@smhc.local',
    department: 'DEPT-002',
    roles: ['ROLE-USER'],
    status: 'active',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'USER-005',
    username: 'auditor01',
    email: 'auditor01@smhc.local',
    department: 'DEPT-001',
    roles: ['ROLE-AUDITOR'],
    status: 'active',
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-01-25T16:30:00Z',
  },
  {
    id: 'USER-006',
    username: 'qc-manager',
    email: 'qc@smhc.local',
    department: 'DEPT-001',
    roles: ['ROLE-AUDITOR'],
    status: 'inactive',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-02-15T13:00:00Z',
  },
  {
    id: 'USER-007',
    username: 'maintenance',
    email: 'maintenance@smhc.local',
    department: 'DEPT-003',
    roles: ['ROLE-USER'],
    status: 'active',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'USER-008',
    username: 'suspended-user',
    email: 'suspended@smhc.local',
    department: 'DEPT-002',
    roles: ['ROLE-USER'],
    status: 'suspended',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-20T15:00:00Z',
  },
];

const masterData: MasterDataResponse['data'] = {
  departments: [
    { id: 'DEPT-001', label: '품질관리팀' },
    { id: 'DEPT-002', label: '생산관리팀' },
    { id: 'DEPT-003', label: '시스템관리팀' },
  ],
  roles: [
    { id: 'ROLE-USER', label: '일반사용자' },
    { id: 'ROLE-AUDITOR', label: '감시자' },
    { id: 'ROLE-SYSTEM_ADMIN', label: '시스템관리자' },
  ],
  statuses: [
    { id: 'active' as const, label: '활성' },
    { id: 'inactive' as const, label: '비활성' },
    { id: 'suspended' as const, label: '정지' },
  ],
};

// sessionStorage에서 데이터 로드/저장
const getUsersFromStorage = (): User[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialUsers;
  } catch {
    return initialUsers;
  }
};

const saveUsersToStorage = (users: User[]): void => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// 임의 네트워크 오류 시뮬레이션 (선택: 0.5% 확률)
const maybeThrowError = (errorRate = 0.005): void => {
  if (Math.random() < errorRate) {
    throw new Error('임의 네트워크 오류 발생 (목데이터 시뮬레이션)');
  }
};

// API 함수들 (목데이터 기반)

/**
 * GET /api/system/users
 * 사용자 목록 조회 (페이징, 검색, 필터)
 */
export async function getUserList(
  params: UserListParams,
): Promise<UserListResponse> {
  // 네트워크 지연 시뮬레이션 (200-500ms)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 200),
  );

  maybeThrowError();

  let users = getUsersFromStorage();

  // 검색 필터 적용
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower),
    );
  }

  // 부서 필터 적용
  if (params.department && params.department !== '') {
    users = users.filter((u) => u.department === params.department);
  }

  // 역할 필터 적용
  if (params.role && params.role !== '') {
    users = users.filter((u) => u.roles.includes(params.role as string));
  }

  // 상태 필터 적용
  if (params.status) {
    users = users.filter((u) => u.status === params.status);
  }

  // 페이징 계산
  const total = users.length;
  const startIdx = (params.page - 1) * params.pageSize;
  const endIdx = startIdx + params.pageSize;
  const paginatedUsers = users.slice(startIdx, endIdx);

  return {
    success: true,
    data: {
      users: paginatedUsers,
      total,
      page: params.page,
      pageSize: params.pageSize,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * POST /api/system/users
 * 사용자 생성
 */
export async function createUser(
  request: UserCreateRequest,
): Promise<UserDetailResponse> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 200),
  );

  maybeThrowError();

  // 유효성 검사
  if (!request.username || !request.email) {
    throw new Error('사용자명과 이메일은 필수입니다.');
  }

  const users = getUsersFromStorage();

  // 중복 검사
  if (users.some((u) => u.username === request.username)) {
    throw new Error('이미 존재하는 사용자명입니다.');
  }

  // 새 사용자 생성
  const newUser: User = {
    id: `USER-${Date.now()}`,
    ...request,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersToStorage(users);

  return {
    success: true,
    data: newUser,
    timestamp: new Date().toISOString(),
  };
}

/**
 * PUT /api/system/users/{userId}
 * 사용자 수정
 */
export async function updateUser(
  userId: string,
  request: UserUpdateRequest,
): Promise<UserDetailResponse> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 200),
  );

  maybeThrowError();

  const users = getUsersFromStorage();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const updatedUser: User = {
    ...users[userIndex],
    ...request,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  saveUsersToStorage(users);

  return {
    success: true,
    data: updatedUser,
    timestamp: new Date().toISOString(),
  };
}

/**
 * DELETE /api/system/users/{userId}
 * 사용자 삭제
 */
export async function deleteUser(userId: string): Promise<ApiResponse<null>> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 200),
  );

  maybeThrowError();

  const users = getUsersFromStorage();
  const filteredUsers = users.filter((u) => u.id !== userId);

  if (filteredUsers.length === users.length) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  saveUsersToStorage(filteredUsers);

  return {
    success: true,
    data: null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * GET /api/system/users/options
 * 마스터 데이터 조회 (부서, 역할, 상태)
 */
export async function getMasterData(): Promise<MasterDataResponse> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 100 + 100),
  );

  maybeThrowError();

  return {
    success: true,
    data: masterData,
    timestamp: new Date().toISOString(),
  };
}
