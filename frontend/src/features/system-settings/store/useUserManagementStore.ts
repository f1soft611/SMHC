import { create } from 'zustand';
import type { User, UserFilterState } from '../types/userManagement';

interface UserManagementStore {
  // UI 상태
  selectedUser: User | null;
  isDialogOpen: boolean;
  isCreateMode: boolean;

  // 필터 상태
  filters: UserFilterState;

  // Actions
  setSelectedUser: (user: User | null) => void;
  openDialog: (mode: 'create' | 'edit', user?: User) => void;
  closeDialog: () => void;
  setFilters: (filters: Partial<UserFilterState>) => void;
  resetFilters: () => void;
}

const initialFilters: UserFilterState = {
  search: '',
  department: '',
  role: '',
  status: '',
};

export const useUserManagementStore = create<UserManagementStore>((set) => ({
  // 초기 상태
  selectedUser: null,
  isDialogOpen: false,
  isCreateMode: true,
  filters: initialFilters,

  // Actions
  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  openDialog: (mode: 'create' | 'edit', user?: User) => {
    set({
      isDialogOpen: true,
      isCreateMode: mode === 'create',
      selectedUser: mode === 'edit' && user ? user : null,
    });
  },

  closeDialog: () => {
    set({
      isDialogOpen: false,
      selectedUser: null,
    });
  },

  setFilters: (filters: Partial<UserFilterState>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
