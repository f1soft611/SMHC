import { apiClient } from '../../../util/axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

const AUTH_MOCK_ENABLED =
  (import.meta.env.VITE_AUTH_MOCK_ENABLED ?? 'true').toLowerCase() === 'true';

const MOCK_CREDENTIAL = {
  tenantCode: 'SMHC-DEMO',
  username: 'admin',
  password: 'admin1234',
} as const;

function buildMockLoginResponse(
  tenantCode: string,
  username: string,
): LoginResponse {
  return {
    accessToken: `mock-token-${Date.now()}`,
    user: {
      id: 'MVP-USER-001',
      tenantCode,
      username,
      roles: ['ROLE_USER'],
    },
  };
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  if (AUTH_MOCK_ENABLED) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });

    if (
      payload.tenantCode !== MOCK_CREDENTIAL.tenantCode ||
      payload.username !== MOCK_CREDENTIAL.username ||
      payload.password !== MOCK_CREDENTIAL.password
    ) {
      throw new Error('업체코드 또는 아이디/비밀번호가 올바르지 않습니다.');
    }

    return buildMockLoginResponse(payload.tenantCode, payload.username);
  }

  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}
