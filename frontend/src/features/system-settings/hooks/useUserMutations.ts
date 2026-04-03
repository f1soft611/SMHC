import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser } from '../api/userManagementApi';
import type {
  UserCreateRequest,
  UserUpdateRequest,
} from '../types/userManagement';
import { userListQueryKeys } from './useUserListQuery';

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * useMutation: POST /api/system/users (생성)
 */
export function useCreateUserMutation(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserCreateRequest) => createUser(request),
    onSuccess: () => {
      // 사용자 목록 재조회
      queryClient.invalidateQueries({
        queryKey: userListQueryKeys.lists(),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error: Error) => {
      callbacks?.onError?.(error);
    },
  });
}

/**
 * useMutation: PUT /api/system/users/{userId} (수정)
 */
export function useUpdateUserMutation(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      request,
    }: {
      userId: string;
      request: UserUpdateRequest;
    }) => updateUser(userId, request),
    onSuccess: () => {
      // 사용자 목록 재조회
      queryClient.invalidateQueries({
        queryKey: userListQueryKeys.lists(),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error: Error) => {
      callbacks?.onError?.(error);
    },
  });
}

/**
 * useMutation: DELETE /api/system/users/{userId} (삭제)
 */
export function useDeleteUserMutation(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      // 사용자 목록 재조회
      queryClient.invalidateQueries({
        queryKey: userListQueryKeys.lists(),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error: Error) => {
      callbacks?.onError?.(error);
    },
  });
}
