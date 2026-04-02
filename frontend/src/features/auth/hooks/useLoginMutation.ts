import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginRequest } from '../types/auth';

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginApi(payload),
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}
