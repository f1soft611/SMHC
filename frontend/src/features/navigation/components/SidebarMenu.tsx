import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import {
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { filterMenuCategoriesByRoles } from '../constants/menuTree';
import type { MenuItem } from '../types/menu';
import { useAuthStore } from '../../auth/store/useAuthStore';

const emptyRoles: string[] = [];

interface SidebarMenuProps {
  selectedItemId: string;
  onSelect: (itemId: string) => void;
}

function MenuStatusChip({ item }: { item: MenuItem }) {
  if (item.status === 'ready') {
    return <Chip size="small" color="success" label="사용 가능" />;
  }

  return <Chip size="small" variant="outlined" label="준비중" />;
}

export function SidebarMenu({ selectedItemId, onSelect }: SidebarMenuProps) {
  const roles = useAuthStore((state) => state.user?.roles ?? emptyRoles);
  const visibleCategories = useMemo(
    () => filterMenuCategoriesByRoles(roles),
    [roles],
  );

  return (
    <Paper
      sx={{
        p: 2,
        border: '1px solid rgba(11, 107, 111, 0.12)',
        minHeight: 520,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        메뉴
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        핵심 메뉴 우선 구성
      </Typography>

      <Stack spacing={2}>
        {visibleCategories.map((category) => (
          <Stack key={category.id} spacing={0.4}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ px: 1 }}
            >
              {category.label}
            </Typography>
            <List dense disablePadding>
              {category.items.map((item) => {
                const selected = selectedItemId === item.id;

                return (
                  <ListItemButton
                    key={item.id}
                    selected={selected}
                    onClick={() => onSelect(item.id)}
                    sx={{ borderRadius: 1.5, mb: 0.4 }}
                  >
                    <ListItemText
                      primary={item.label}
                      secondary={
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <MenuStatusChip item={item} />
                        </Stack>
                      }
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: selected ? 700 : 500,
                      }}
                    />
                    {selected ? (
                      <CheckCircleRounded color="primary" fontSize="small" />
                    ) : (
                      <RadioButtonUncheckedRounded
                        color="disabled"
                        fontSize="small"
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
