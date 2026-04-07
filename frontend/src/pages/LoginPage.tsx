import { Box, Paper, Stack, Typography } from '@mui/material';
import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background:
          'radial-gradient(circle at 10% 10%, rgba(11,107,111,0.28), transparent 35%), radial-gradient(circle at 90% 20%, rgba(242,143,59,0.24), transparent 35%), linear-gradient(135deg, #f4f7f8 0%, #e8f0f2 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 430,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src="/favicon.svg?v=20260407"
              alt="SMHC 로고"
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                boxShadow: '0 10px 24px rgba(7, 71, 74, 0.18)',
              }}
            />
            <Stack spacing={0.25}>
              <Typography fontWeight={800} color="primary.main">
                SMHC Access
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Smart HACCP Cloud Service
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            로그인 후 메인 대시보드로 이동합니다.
          </Typography>

          <LoginForm />
        </Stack>
      </Paper>
    </Box>
  );
}
