import LoginRounded from '@mui/icons-material/LoginRounded';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { useMenuStore } from '../../navigation/store/useMenuStore';

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const resetMenuSelection = useMenuStore((state) => state.resetMenuSelection);

  const [tenantCode, setTenantCode] = useState('SMHC-DEMO');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin1234');

  const errorMessage =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : '로그인 처리 중 오류가 발생했습니다.';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await loginMutation.mutateAsync({
      tenantCode: tenantCode.trim().toUpperCase(),
      username: username.trim(),
      password,
    });

    resetMenuSelection();
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary">
          운영 연동 전 MVP 계정은 SMHC-DEMO / admin / admin1234 입니다.
        </Typography>

        <TextField
          label="업체코드"
          autoComplete="organization"
          value={tenantCode}
          onChange={(event) => setTenantCode(event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="아이디"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
        />

        {loginMutation.isError && (
          <Alert severity="error">{errorMessage}</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loginMutation.isPending}
          startIcon={
            loginMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <LoginRounded />
            )
          }
          sx={{ mt: 1 }}
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </Stack>
    </Box>
  );
}
