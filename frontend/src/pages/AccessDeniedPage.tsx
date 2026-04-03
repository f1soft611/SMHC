import LockOutlined from '@mui/icons-material/LockOutlined';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.error.main, 0.22)}`,
          })}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LockOutlined color="error" />
              <Typography variant="h5" fontWeight={700}>
                접근 권한이 없습니다
              </Typography>
            </Stack>

            <Typography color="text.secondary">
              현재 계정으로는 요청한 메뉴에 접근할 수 없습니다. 관리자에게 권한
              요청 후 다시 시도해 주세요.
            </Typography>

            <Button
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
