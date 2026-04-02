export interface AuthUser {
  id: string;
  tenantCode: string;
  username: string;
  roles: string[];
}

export interface LoginRequest {
  tenantCode: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

export interface AuthActions {
  setAuth: (payload: LoginResponse) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;
