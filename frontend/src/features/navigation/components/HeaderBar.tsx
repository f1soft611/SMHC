import MenuRounded from '@mui/icons-material/MenuRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMenuDrawerState } from '../store/useMenuDrawerState';

interface HeaderBarProps {
  onMenuToggle: () => void;
}

export function HeaderBar({ onMenuToggle }: HeaderBarProps) {
  const { toggleDrawer } = useMenuDrawerState();

  const handleMenuClick = () => {
    toggleDrawer();
    onMenuToggle();
  };

  return (
    <Paper
      sx={(theme) => ({
        px: { xs: 1.5, md: 3 },
        py: 1,
        borderRadius: 0,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        background: `linear-gradient(145deg, ${alpha(theme.palette.common.white, 0.95)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.dark, 0.04)}`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: (t) => t.zIndex.appBar - 1,
      })}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* 로고/제목 */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ minWidth: 0 }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="primary.main"
            >
              SMHC
            </Typography>
          </Box>
        </Stack>

        {/* 검색 */}
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={(theme) => ({
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            minWidth: 200,
            maxWidth: 400,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.common.white, 0.8),
            '&:focus-within': {
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          })}
        >
          <SearchRounded
            sx={{
              fontSize: 18,
              color: 'text.secondary',
            }}
          />
          <InputBase
            placeholder="메뉴 검색..."
            sx={{
              flex: 1,
              '& input': {
                py: 0.4,
                fontSize: 13,
                '&::placeholder': {
                  opacity: 0.6,
                },
              },
            }}
          />
        </Paper>

        {/* 메뉴 버튼 */}
        <IconButton
          onClick={handleMenuClick}
          sx={(theme) => ({
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            },
          })}
        >
          <MenuRounded />
        </IconButton>
      </Stack>
    </Paper>
  );
}
