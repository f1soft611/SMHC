import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import SettingsSuggestRounded from '@mui/icons-material/SettingsSuggestRounded';
import SensorsRounded from '@mui/icons-material/SensorsRounded';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { menuCategories } from '../constants/menuTree';
import type { MenuCategory } from '../types/menu';
import { useMenuDrawerState } from '../store/useMenuDrawerState';

interface MenuDrawerProps {
  selectedCategoryId: string;
  selectedItemId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectItem: (itemId: string) => void;
  onClose: () => void;
}

function getCategoryIcon(category: MenuCategory) {
  switch (category.id) {
    case 'smart-monitoring':
      return <SensorsRounded sx={{ fontSize: 18 }} />;
    case 'ccp-management':
      return <CheckCircleRounded sx={{ fontSize: 18 }} />;
    case 'haccp-docs':
      return <DescriptionRounded sx={{ fontSize: 18 }} />;
    case 'analytics-report':
      return <InsightsRounded sx={{ fontSize: 18 }} />;
    default:
      return <SettingsSuggestRounded sx={{ fontSize: 18 }} />;
  }
}

export function MenuDrawer({
  selectedCategoryId,
  selectedItemId,
  onSelectCategory,
  onSelectItem,
  onClose,
}: MenuDrawerProps) {
  const { isOpen } = useMenuDrawerState();
  const selectedCategory = menuCategories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
  };

  const handleItemClick = (itemId: string) => {
    onSelectItem(itemId);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 360 },
          maxWidth: '100vw',
          padding: 2,
        },
      }}
    >
      <Stack spacing={2} sx={{ height: '100%' }}>
        {/* 헤더 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            운영 메뉴
          </Typography>
          <CloseRounded
            onClick={onClose}
            sx={{ cursor: 'pointer', fontSize: 24 }}
          />
        </Stack>

        <Divider />

        {/* 카테고리 탭 */}
        <Stack spacing={0.5}>
          {menuCategories.map((category) => {
            const readyCount = category.items.filter(
              (item) => item.status === 'ready',
            ).length;
            const isSelected = selectedCategoryId === category.id;

            return (
              <ListItemButton
                key={category.id}
                selected={isSelected}
                onClick={() => handleCategoryClick(category.id)}
                sx={(theme) => ({
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : 'transparent',
                  border: isSelected
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : '1px solid transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                })}
              >
                <Stack spacing={0.5} sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      {getCategoryIcon(category)}
                      <Typography
                        component="span"
                        fontSize={13}
                        fontWeight={600}
                      >
                        {category.label}
                      </Typography>
                    </Stack>
                    <Chip
                      label={`${readyCount}/${category.items.length}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                  </Stack>
                  {isSelected && (
                    <Typography
                      component="span"
                      fontSize={12}
                      color="text.secondary"
                    >
                      {category.description}
                    </Typography>
                  )}
                </Stack>
              </ListItemButton>
            );
          })}
        </Stack>

        <Divider />

        {/* 아이템 목록 */}
        {selectedCategory && (
          <Stack spacing={1} sx={{ flex: 1, overflow: 'auto' }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ px: 0.5 }}
            >
              {selectedCategory.label} 작업 목록
            </Typography>

            <Stack spacing={0.75}>
              {selectedCategory.items.map((item) => {
                const isItemSelected = selectedItemId === item.id;

                return (
                  <ListItemButton
                    key={item.id}
                    selected={isItemSelected}
                    onClick={() => handleItemClick(item.id)}
                    sx={(theme) => ({
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 0.75,
                      px: 1.25,
                      py: 1,
                      borderRadius: 1,
                      bgcolor: isItemSelected
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                      border: isItemSelected
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    })}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                      sx={{ width: '100%' }}
                    >
                      <Box
                        sx={{
                          mt: 0.25,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.status === 'ready' ? (
                          <RadioButtonUncheckedRounded
                            sx={{
                              fontSize: 16,
                              color: 'primary.main',
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedRounded
                            sx={{
                              fontSize: 16,
                              color: 'text.disabled',
                            }}
                          />
                        )}
                      </Box>
                      <Stack spacing={0.4} sx={{ flex: 1 }}>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color={
                            item.status === 'ready'
                              ? 'text.primary'
                              : 'text.disabled'
                          }
                        >
                          {item.label}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {item.objective}
                        </Typography>
                        {item.highlight && (
                          <Chip
                            label={item.highlight}
                            size="small"
                            sx={{ width: 'fit-content', mt: 0.25 }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </ListItemButton>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
}
