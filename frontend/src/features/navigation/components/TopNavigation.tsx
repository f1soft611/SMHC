import { Box } from '@mui/material';
import { memo } from 'react';
import { HeaderBar } from './HeaderBar';
import { MenuDrawer } from './MenuDrawer';

export const TopNavigation = memo(function TopNavigation() {
  return (
    <Box>
      {/* Compact 헤더 */}
      <HeaderBar />

      {/* 메뉴 드로어 */}
      <MenuDrawer />
    </Box>
  );
});
