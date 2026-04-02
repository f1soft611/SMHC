import { Box } from '@mui/material';
import { HeaderBar } from './HeaderBar';
import { MenuDrawer } from './MenuDrawer';
import { useMenuDrawerState } from '../store/useMenuDrawerState';

interface TopNavigationProps {
  selectedCategoryId: string;
  selectedItemId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectItem: (itemId: string) => void;
}

export function TopNavigation({
  selectedCategoryId,
  selectedItemId,
  onSelectCategory,
  onSelectItem,
}: TopNavigationProps) {
  const { closeDrawer } = useMenuDrawerState();

  return (
    <Box>
      {/* Compact 헤더 */}
      <HeaderBar onMenuToggle={() => {}} />

      {/* 메뉴 드로어 */}
      <MenuDrawer
        selectedCategoryId={selectedCategoryId}
        selectedItemId={selectedItemId}
        onSelectCategory={onSelectCategory}
        onSelectItem={onSelectItem}
        onClose={closeDrawer}
      />
    </Box>
  );
}
