import MenuRounded from '@mui/icons-material/MenuRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { IconButton, InputBase, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMenuDrawerState } from '../store/useMenuDrawerState';

export function HeaderBar() {
  const toggleDrawer = useMenuDrawerState((state) => state.toggleDrawer);

  return (
    <Paper
      sx={(theme) => ({
        px: { xs: 1.5, md: 3 },
        py: 1,
        borderRadius: 0,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
        background: `linear-gradient(145deg, ${alpha(theme.palette.common.white, 0.95)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.dark, 0.04)}`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: (t) => t.zIndex.appBar - 1,
      })}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'transparent',
          boxShadow: 'none',
          gap: 1,
        }}
      >
        {/* 메뉴 버튼 (왼쪽) */}
        <IconButton
          aria-label="메뉴 열기"
          onClick={toggleDrawer}
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

        {/* 로고 (가운데 고정) */}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="primary.main"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          SMHC
        </Typography>

        {/* 검색 (오른쪽) */}
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={(theme) => ({
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: { xs: 148, sm: 220, md: 320 },
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
            inputProps={{ 'aria-label': '메뉴 검색' }}
          />
        </Paper>
      </Paper>
    </Paper>
  );
}
