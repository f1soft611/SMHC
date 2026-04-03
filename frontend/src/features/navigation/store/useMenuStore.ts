import { create } from 'zustand';
import {
  defaultMenuItemId,
  findMenuSelectionByPath,
  menuCategories,
} from '../constants/menuTree';

interface MenuUiState {
  selectedCategoryId: string;
  selectedItemId: string;
  setSelectedCategory: (categoryId: string) => void;
  setSelectedItemId: (itemId: string) => void;
  syncMenuByPath: (pathname: string) => void;
  resetMenuSelection: () => void;
}

function getDefaultCategoryId(): string {
  const defaultCategory = menuCategories.find((cat) =>
    cat.items.some((item) => item.id === defaultMenuItemId),
  );

  return defaultCategory?.id ?? menuCategories[0]?.id ?? 'smart-monitoring';
}

export const useMenuStore = create<MenuUiState>((set) => ({
  selectedCategoryId: getDefaultCategoryId(),
  selectedItemId: defaultMenuItemId,
  setSelectedCategory: (categoryId) => set({ selectedCategoryId: categoryId }),
  setSelectedItemId: (itemId) =>
    set({
      selectedItemId: itemId,
      selectedCategoryId:
        menuCategories.find((cat) =>
          cat.items.some((item) => item.id === itemId),
        )?.id ?? getDefaultCategoryId(),
    }),
  syncMenuByPath: (pathname) => {
    const selection = findMenuSelectionByPath(pathname);

    if (!selection) {
      return;
    }

    set((state) => {
      if (
        state.selectedItemId === selection.itemId &&
        state.selectedCategoryId === selection.categoryId
      ) {
        return {};
      }

      return {
        selectedCategoryId: selection.categoryId,
        selectedItemId: selection.itemId,
      };
    });
  },
  resetMenuSelection: () =>
    set({
      selectedCategoryId: getDefaultCategoryId(),
      selectedItemId: defaultMenuItemId,
    }),
}));
