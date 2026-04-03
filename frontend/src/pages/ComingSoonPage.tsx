import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findMenuItemByPath } from '../features/navigation/constants/menuTree';

export function ComingSoonPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedMenu = useMemo(() => findMenuItemByPath(pathname), [pathname]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.24)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.16)} 0%, ${alpha(theme.palette.common.white, 0.96)} 55%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
          })}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ConstructionRounded color="warning" />
              <Typography variant="h5" fontWeight={700}>
                준비중 기능
              </Typography>
            </Stack>

            <Typography color="text.secondary">
              선택한 메뉴는 현재 단계적으로 개발 중입니다. 준비가 완료되면
              동일한 경로에서 바로 사용할 수 있습니다.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={selectedMenu?.label ?? '신규 기능'}
                color="warning"
                variant="outlined"
              />
              <Chip label={pathname} variant="outlined" />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {selectedMenu?.objective ??
                '화면 요구사항과 API 계약이 확정되는 대로 배포됩니다.'}
            </Typography>

            <Button
              startIcon={<ArrowBackRounded />}
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{ alignSelf: 'flex-start' }}
            >
              대시보드로 이동
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
