import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import AssignmentTurnedInRounded from '@mui/icons-material/AssignmentTurnedInRounded';
import FactoryRounded from '@mui/icons-material/FactoryRounded';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import SyncRounded from '@mui/icons-material/SyncRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import {
  defaultMenuItemId,
  findCategoryByItemId,
  findMenuItemById,
} from '../features/navigation/constants/menuTree';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import { useMenuStore } from '../features/navigation/store/useMenuStore';
import { useOverviewQuery } from '../features/monitoring/hooks/useOverviewQuery';
import { usePlantUiStore } from '../features/monitoring/store/usePlantUiStore';
import type { MenuStatus } from '../features/navigation/types/menu';
import type { DashboardOverview } from '../features/monitoring/types/overview';

interface SiteOption {
  id: string;
  label: string;
}

const defaultSites: SiteOption[] = [
  { id: 'SITE-01', label: '부산 생산센터' },
  { id: 'SITE-02', label: '대전 가공센터' },
];

const sitesByTenant: Record<string, SiteOption[]> = {
  'SMHC-DEMO': defaultSites,
  'SMHC-BUSAN': [
    { id: 'BUSAN-01', label: '부산 본공장' },
    { id: 'BUSAN-02', label: '부산 포장센터' },
  ],
  'SMHC-SEOUL': [
    { id: 'SEOUL-01', label: '서울 품질관리센터' },
    { id: 'SEOUL-02', label: '서울 원료보관동' },
  ],
};

function getSitesByTenant(tenantCode?: string): SiteOption[] {
  if (!tenantCode) {
    return defaultSites;
  }

  return (
    sitesByTenant[tenantCode] ?? [
      { id: `${tenantCode}-01`, label: `${tenantCode} 기본 사업장` },
    ]
  );
}

const fallbackOverview: DashboardOverview = {
  siteName: 'SMHC 통합 관제센터',
  verifiedChecks: 128,
  delayedChecks: 6,
  cloudSyncRate: 98,
  processes: [
    { id: 'P1', name: '원료 수급', complianceRate: 97, openIssues: 1 },
    { id: 'P2', name: '살균 공정', complianceRate: 96, openIssues: 2 },
    { id: 'P3', name: '포장 점검', complianceRate: 99, openIssues: 0 },
  ],
};

// 샘플 차트 데이터
const ccpTrendData = [
  { time: '13:40', temp: 75, target: 90, upper: 95, lower: 85 },
  { time: '13:45', temp: 78, target: 90, upper: 95, lower: 85 },
  { time: '13:50', temp: 82, target: 90, upper: 95, lower: 85 },
  { time: '13:55', temp: 88, target: 90, upper: 95, lower: 85 },
  { time: '14:00', temp: 90, target: 90, upper: 95, lower: 85 },
];

const complianceData = [
  { process: '원료 수급', compliance: 97 },
  { process: '살균 공정', compliance: 96 },
  { process: '포장 점검', compliance: 99 },
];

const dateRangeOptions = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '주간' },
  { value: 'month', label: '월간' },
] as const;

function getStatusLabel(status: MenuStatus) {
  return status === 'ready' ? '바로 사용 가능' : '준비중';
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const selectedItemId = useMenuStore((state) => state.selectedItemId);
  const resetMenuSelection = useMenuStore((state) => state.resetMenuSelection);
  const selectedSiteId = usePlantUiStore((state) => state.selectedSiteId);
  const dateRange = usePlantUiStore((state) => state.dateRange);
  const setSelectedSiteId = usePlantUiStore((state) => state.setSelectedSiteId);
  const setDateRange = usePlantUiStore((state) => state.setDateRange);
  const tenantSites = useMemo(
    () => getSitesByTenant(user?.tenantCode),
    [user?.tenantCode],
  );
  const overviewQuery = useOverviewQuery(selectedSiteId);

  useEffect(() => {
    if (!tenantSites.some((site) => site.id === selectedSiteId)) {
      setSelectedSiteId(tenantSites[0]?.id ?? '');
    }
  }, [selectedSiteId, setSelectedSiteId, tenantSites]);

  const handleLogout = () => {
    clearAuth();
    resetMenuSelection();
    navigate('/login', { replace: true });
  };

  const selectedMenu =
    findMenuItemById(selectedItemId) ?? findMenuItemById(defaultMenuItemId);
  const selectedCategory =
    findCategoryByItemId(selectedItemId) ??
    findCategoryByItemId(defaultMenuItemId);
  const isMonitoringMain = selectedItemId === defaultMenuItemId;

  const overview = useMemo(() => {
    const data = overviewQuery.data;

    if (!data) {
      return fallbackOverview;
    }

    return {
      siteName: data.siteName ?? fallbackOverview.siteName,
      verifiedChecks: data.verifiedChecks ?? fallbackOverview.verifiedChecks,
      delayedChecks: data.delayedChecks ?? fallbackOverview.delayedChecks,
      cloudSyncRate: data.cloudSyncRate ?? fallbackOverview.cloudSyncRate,
      processes: Array.isArray(data.processes)
        ? data.processes
        : fallbackOverview.processes,
    };
  }, [overviewQuery.data]);

  const priorityTasks = useMemo(
    () => [
      {
        title: '지연 점검 후속 처리',
        value: `${overview.delayedChecks}건`,
        description: '담당자 승인과 개선조치 입력이 필요한 항목입니다.',
        tone: 'warning' as const,
      },
      {
        title: '센서 데이터 관찰',
        value: `${overview.cloudSyncRate}%`,
        description: 'IoT 동기화율과 실시간 온도 추세를 함께 확인합니다.',
        tone: 'primary' as const,
      },
      {
        title: '공정별 현장 이슈',
        value: `${overview.processes.reduce((sum, process) => sum + process.openIssues, 0)}건`,
        description: '열린 이슈가 있는 공정부터 우선 대응 순서를 잡습니다.',
        tone: 'secondary' as const,
      },
    ],
    [overview],
  );

  const kpiCards = useMemo(
    () => [
      {
        title: '검증 완료 점검',
        value: `${overview.verifiedChecks}`,
        chip: '정상 흐름',
        description:
          '오늘 기준 검증이 완료되어 운영 기준을 만족한 점검 수입니다.',
        accent: 'rgba(28,140,78,0.16)',
        background:
          'linear-gradient(135deg, rgba(28,140,78,0.08) 0%, rgba(28,140,78,0.02) 100%)',
        color: 'success.main',
      },
      {
        title: '지연 점검',
        value: `${overview.delayedChecks}`,
        chip: '즉시 확인',
        description:
          '현장 확인 또는 전자서명 후속 조치가 필요한 점검 수입니다.',
        accent: 'rgba(242,143,59,0.2)',
        background:
          'linear-gradient(135deg, rgba(242,143,59,0.08) 0%, rgba(242,143,59,0.02) 100%)',
        color: 'secondary.main',
      },
      {
        title: '클라우드 동기화율',
        value: `${overview.cloudSyncRate}%`,
        chip: '데이터 연속성',
        description:
          '센서 수집값과 점검 데이터가 운영 서버와 동기화된 비율입니다.',
        accent: 'rgba(11,107,111,0.2)',
        background:
          'linear-gradient(135deg, rgba(11,107,111,0.08) 0%, rgba(11,107,111,0.02) 100%)',
        color: 'primary.main',
      },
    ],
    [overview],
  );

  const selectedMenuDescription =
    selectedMenu?.description ??
    '선택한 업무 메뉴의 운영 준비 상태와 후속 연계 범위를 상단에서 확인할 수 있습니다.';

  const selectedMenuObjective =
    selectedMenu?.objective ??
    '업무 흐름과 데이터 연계 기준을 먼저 확인하세요.';

  const selectedMenuHighlight =
    selectedMenu?.highlight ?? '후속 화면 설계와 연결 범위를 정리 중입니다.';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      <TopNavigation />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Paper
          sx={(theme) => ({
            mb: 2.5,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${alpha(theme.palette.common.white, 0.96)} 48%, ${alpha(theme.palette.secondary.light, 0.18)} 100%)`,
            boxShadow: `0 20px 48px ${alpha(theme.palette.primary.dark, 0.08)}`,
          })}
        >
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            justifyContent="space-between"
            spacing={{ xs: 2.5, xl: 3 }}
          >
            <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<PlaceRounded />}
                  color="primary"
                  variant="outlined"
                  label={overview.siteName || 'SMART HACCP CLOUD'}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.65),
                  }}
                />
                <Chip
                  icon={<FactoryRounded />}
                  color="primary"
                  variant="outlined"
                  label={`업체 ${user?.tenantCode ?? '-'}`}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.65),
                  }}
                />
                <Chip
                  icon={<PersonRounded />}
                  color="primary"
                  variant="outlined"
                  label={`사용자 ${user?.username ?? 'unknown'}`}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.65),
                  }}
                />
              </Stack>

              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', letterSpacing: '0.14em' }}
                >
                  {selectedCategory?.label ?? 'OPERATION OVERVIEW'}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 0.5, color: 'primary.dark' }}
                >
                  {selectedMenu?.label ?? '실시간 공정 현황'}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 620 }}
                >
                  {selectedMenuDescription}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                <Chip
                  color={selectedCategory?.tone ?? 'primary'}
                  label={
                    selectedCategory?.summary ?? '운영 흐름을 준비 중입니다.'
                  }
                />
                <Chip
                  variant="outlined"
                  color={selectedMenu?.tone ?? 'primary'}
                  label={getStatusLabel(selectedMenu?.status ?? 'coming-soon')}
                />
                <Chip
                  variant="outlined"
                  icon={<InsightsRounded />}
                  label={selectedMenuHighlight}
                />
              </Stack>

              <Paper
                sx={(theme) => ({
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.common.white, 0.72),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  이번 화면에서 해야 할 일
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.3 }}>
                  {selectedMenuObjective}
                </Typography>
              </Paper>
            </Stack>

            <Paper
              sx={(theme) => ({
                p: 2,
                minWidth: { xs: '100%', xl: 320 },
                borderRadius: 2.5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                bgcolor: alpha(theme.palette.common.white, 0.72),
                backdropFilter: 'blur(10px)',
              })}
            >
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="subtitle1">운영 제어</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.4 }}
                  >
                    사업장과 조회 범위를 바꿔 현재 선택 업무의 컨텍스트를
                    맞춥니다.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.75 }}
                  >
                    조회 사업장
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={selectedSiteId}
                    onChange={(event) => setSelectedSiteId(event.target.value)}
                  >
                    {tenantSites.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {site.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.75 }}
                  >
                    조회 범위
                  </Typography>
                  <ToggleButtonGroup
                    fullWidth
                    exclusive
                    size="small"
                    value={dateRange}
                    onChange={(_event, value) => {
                      if (value) {
                        setDateRange(value);
                      }
                    }}
                  >
                    {dateRangeOptions.map((option) => (
                      <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    color="success"
                    label={`검증 완료 ${overview.verifiedChecks}`}
                  />
                  <Chip
                    size="small"
                    color="warning"
                    label={`지연 ${overview.delayedChecks}`}
                  />
                </Stack>

                <Paper
                  sx={(theme) => ({
                    px: 1.25,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  })}
                >
                  <Typography variant="caption" color="text.secondary">
                    운영 메모
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.4 }}>
                    {selectedSiteId} 기준으로 센서 동기화와 점검 지연을 함께
                    보는 구성을 유지합니다.
                  </Typography>
                </Paper>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                  startIcon={<LogoutRounded />}
                >
                  로그아웃
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Paper>

        {isMonitoringMain ? (
          <>
            {overviewQuery.isError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                서버 응답을 불러오지 못해 샘플 데이터로 표시 중입니다.
              </Alert>
            )}

            <Grid container spacing={2.5}>
              {kpiCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      p: 2,
                      background: card.background,
                      border: `2px solid ${card.accent}`,
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {card.title}
                        </Typography>
                        <Chip size="small" label={card.chip} />
                      </Stack>
                      <Typography
                        variant="h4"
                        sx={{ color: card.color, fontWeight: 800 }}
                      >
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}

              <Grid size={{ xs: 12, lg: 7 }}>
                <Card
                  sx={{ p: 2.25, border: '1px solid rgba(11, 107, 111, 0.12)' }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        오늘의 운영 포커스
                      </Typography>
                      <Chip
                        size="small"
                        color="primary"
                        label={selectedSiteId}
                      />
                    </Stack>

                    <Grid container spacing={1.5}>
                      {priorityTasks.map((task, index) => (
                        <Grid key={task.title} size={{ xs: 12, md: 4 }}>
                          <Paper
                            sx={(theme) => ({
                              p: 1.5,
                              borderRadius: 2,
                              height: '100%',
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              bgcolor: alpha(theme.palette.common.white, 0.68),
                            })}
                          >
                            <Stack spacing={0.8}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                우선순위 {index + 1}
                              </Typography>
                              <Typography variant="subtitle1">
                                {task.title}
                              </Typography>
                              <Typography
                                variant="h6"
                                color={`${task.tone}.main`}
                              >
                                {task.value}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Card
                  sx={{ p: 2.25, border: '1px solid rgba(11, 107, 111, 0.12)' }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h6" fontWeight={700}>
                      운영 컨텍스트
                    </Typography>

                    <Stack spacing={1.25}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WarningAmberRounded color="warning" fontSize="small" />
                        <Typography variant="body2">
                          지연 점검 {overview.delayedChecks}건은 담당자 승인과
                          개선조치 기록이 필요합니다.
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SyncRounded color="primary" fontSize="small" />
                        <Typography variant="body2">
                          클라우드 동기화율 {overview.cloudSyncRate}% 기준으로
                          센서 연결 상태를 유지 중입니다.
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AssignmentTurnedInRounded
                          color="success"
                          fontSize="small"
                        />
                        <Typography variant="body2">
                          검증 완료 {overview.verifiedChecks}건을 기준으로 오늘
                          운영 안정성을 확인합니다.
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeRounded color="secondary" fontSize="small" />
                        <Typography variant="body2">
                          조회 범위는{' '}
                          {dateRangeOptions.find(
                            (option) => option.value === dateRange,
                          )?.label ?? '오늘'}{' '}
                          기준으로 표시됩니다.
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    border: '1px solid rgba(11, 107, 111, 0.12)',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      CCP 온도 추이
                    </Typography>
                    <MoreVertRounded
                      fontSize="small"
                      sx={{ ml: 'auto', color: 'text.secondary' }}
                    />
                  </Stack>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ccpTrendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(11,107,111,0.1)"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        stroke="rgba(11,107,111,0.4)"
                      />
                      <YAxis
                        domain={[70, 100]}
                        tick={{ fontSize: 12 }}
                        stroke="rgba(11,107,111,0.4)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(11,107,111,0.2)',
                          borderRadius: 8,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#0b6b6f"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    border: '1px solid rgba(11, 107, 111, 0.12)',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      공정별 준수율
                    </Typography>
                    <MoreVertRounded
                      fontSize="small"
                      sx={{ ml: 'auto', color: 'text.secondary' }}
                    />
                  </Stack>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={complianceData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(11,107,111,0.1)"
                      />
                      <XAxis
                        dataKey="process"
                        tick={{ fontSize: 12 }}
                        stroke="rgba(11,107,111,0.4)"
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        stroke="rgba(11,107,111,0.4)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(11,107,111,0.2)',
                          borderRadius: 8,
                        }}
                      />
                      <Bar
                        dataKey="compliance"
                        fill="rgba(11,107,111,0.8)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card
                  sx={{
                    p: 2,
                    border: '1px solid rgba(11, 107, 111, 0.12)',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      공정 신뢰성 현황
                    </Typography>
                    <Chip size="small" color="primary" label={selectedSiteId} />
                  </Stack>

                  <Stack spacing={1.5}>
                    {overview.processes.map((process) => (
                      <Box key={process.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 0.6 }}
                        >
                          <Typography fontWeight={600} fontSize={14}>
                            {process.name}
                          </Typography>
                          <Typography color="text.secondary" fontSize={12}>
                            {process.complianceRate}% / 이슈{' '}
                            {process.openIssues}건
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: 'rgba(11,107,111,0.1)',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${process.complianceRate}%`,
                              bgcolor:
                                process.complianceRate > 97
                                  ? 'success.main'
                                  : process.complianceRate > 94
                                    ? 'secondary.main'
                                    : 'error.main',
                              transition: 'width 0.35s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : (
          <Paper
            sx={(theme) => ({
              p: { xs: 2, md: 3 },
              borderRadius: 5,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              background: `linear-gradient(145deg, ${alpha(theme.palette.common.white, 0.92)} 0%, ${alpha(theme.palette.primary.light, 0.06)} 100%)`,
            })}
          >
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', letterSpacing: '0.14em' }}
                >
                  PREVIEW MODE
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.4 }}>
                  {selectedMenu?.label}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {selectedMenuDescription}
                </Typography>
              </Box>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1">업무 목적</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.8 }}
                    >
                      {selectedMenuObjective}
                    </Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1">준비 상태</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.8 }}
                    >
                      {getStatusLabel(selectedMenu?.status ?? 'coming-soon')}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={selectedMenu?.tone ?? 'primary'}
                      label={selectedMenuHighlight}
                      sx={{ mt: 1 }}
                    />
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1">연계 예정</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.8 }}
                    >
                      권한, 데이터 정책, 세부 화면 정의가 확정되면 이 자리에서
                      후속 업무로 연결됩니다.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
