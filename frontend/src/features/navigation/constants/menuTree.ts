import type { MenuCategory, MenuItem } from '../types/menu';

export const defaultMenuItemId = 'smart-monitoring.ccp-dashboard';
const adminRoles = ['ROLE_ADMIN', 'ROLE-SYSTEM_ADMIN'];
const filteredMenuCategoryCache = new Map<string, MenuCategory[]>();

export const menuCategories: MenuCategory[] = [
  {
    id: 'smart-monitoring',
    label: 'Smart HACCP 모니터링',
    description:
      '센서와 점검 흐름을 한 화면에서 파악하는 실시간 운영 허브입니다.',
    summary: '이상 감지, 현장 확인, 조치 기록까지 가장 빠르게 이어집니다.',
    tone: 'primary',
    items: [
      {
        id: 'smart-monitoring.ccp-dashboard',
        path: '/dashboard',
        label: 'CCP 통합 관제 대시보드',
        status: 'ready',
        description:
          '공정별 CCP 상태, 지연 점검, 동기화 현황을 실시간으로 요약합니다.',
        objective: '오늘 반드시 확인해야 할 위험 신호를 가장 먼저 파악합니다.',
        highlight: '실시간 센서 지표와 점검 상태를 한 번에 확인',
        tone: 'primary',
      },
      {
        id: 'smart-monitoring.realtime-ccp',
        path: '/monitoring/realtime-ccp',
        label: '실시간 CCP 모니터링 현황',
        status: 'coming-soon',
        description: '온도, 시간, 습도 같은 CCP 데이터를 시계열로 추적합니다.',
        objective:
          '한계기준 이탈 징후를 조기에 발견하고 현장 대응 속도를 높입니다.',
        highlight: '센서 상세 그래프와 이탈 히스토리 연결 예정',
        tone: 'info',
      },
    ],
  },
  {
    id: 'ccp-management',
    label: 'CCP 관리',
    description:
      '가열, 냉각, 금속검출 같은 핵심 CCP 일지를 디지털로 관리합니다.',
    summary: '현장 입력과 개선 조치 기록을 표준화해 누락을 줄입니다.',
    tone: 'secondary',
    items: [
      {
        id: 'ccp-management.heating-journal',
        path: '/coming-soon/ccp-management/heating-journal',
        label: '가열공정 데이터 수집/개선일지',
        status: 'coming-soon',
        description:
          '가열 설비의 CCP 측정값과 개선 이력을 전자 일지로 관리합니다.',
        objective:
          '가열 공정의 이상 발생 원인과 후속 조치를 체계적으로 남깁니다.',
        highlight: '전자서명과 개선조치 워크플로우 연계 예정',
        tone: 'secondary',
      },
      {
        id: 'ccp-management.cooling-journal',
        path: '/coming-soon/ccp-management/cooling-journal',
        label: '냉동/냉각 공정 데이터 수집/개선일지',
        status: 'coming-soon',
        description: '냉각 공정 데이터와 개선 이력을 표준 양식으로 축적합니다.',
        objective: '보관 안정성과 품질 변동 원인을 빠르게 추적합니다.',
        highlight: '이상값 자동 감지와 일지 자동 생성 예정',
        tone: 'secondary',
      },
    ],
  },
  {
    id: 'haccp-docs',
    label: 'HACCP 문서 관리',
    description:
      '점검 문서와 조직도, 교육 이력을 비정형 서식까지 포함해 관리합니다.',
    summary: '종이 문서 중심 업무를 디지털 기록과 검색 중심으로 전환합니다.',
    tone: 'success',
    items: [
      {
        id: 'haccp-docs.template-management',
        path: '/haccp-docs/templates',
        label: 'CCP 문서 템플릿 관리',
        status: 'ready',
        description:
          '관리자가 CCP 문서 템플릿 구조와 블록 속성을 생성·관리합니다.',
        objective:
          '새로운 CCP 양식을 개발자 도움 없이 템플릿으로 정의하고 버전 관리합니다.',
        highlight: '템플릿 구조 편집과 블록 메타데이터 관리 화면 제공',
        tone: 'success',
      },
      {
        id: 'haccp-docs.document-writing',
        path: '/haccp-docs/documents',
        label: 'CCP 점검일지 작성',
        status: 'ready',
        description:
          '게시된 템플릿을 기준으로 실제 점검일지를 작성하고 미리보기를 확인합니다.',
        objective:
          '현장 입력과 반복 행, 체크박스, 서술형 기록을 템플릿 기준으로 일관되게 작성합니다.',
        highlight: '버튼 기반 HTML 미리보기와 템플릿 기반 일지 작성 제공',
        tone: 'success',
      },
      {
        id: 'haccp-docs.training-ledger',
        path: '/coming-soon/haccp-docs/training-ledger',
        label: 'HACCP 조직도 및 교육 훈련 대장',
        status: 'coming-soon',
        description: '조직도와 교육 훈련 이력을 문서 단위로 체계화합니다.',
        objective: '감사 시 필요한 조직/교육 이력을 신속하게 제출합니다.',
        highlight: '문서 버전 관리와 검색 UX 연동 예정',
        tone: 'success',
      },
    ],
  },
  {
    id: 'analytics-report',
    label: '데이터 분석 및 보고',
    description:
      '수집 데이터를 공정 성과와 이상 패턴 중심으로 분석하는 리포트 영역입니다.',
    summary: '현황 파악에서 끝나지 않고 추세 해석과 보고까지 이어집니다.',
    tone: 'warning',
    items: [
      {
        id: 'analytics-report.quality-dashboard',
        path: '/coming-soon/analytics-report/quality-dashboard',
        label: '생산 및 품질 종합 대시보드',
        status: 'coming-soon',
        description: '주요 생산 및 품질 KPI를 공정 흐름과 함께 요약합니다.',
        objective: '현장 실적과 품질 상태를 동일한 시야에서 판단합니다.',
        highlight: '공정 KPI 상관 분석 차트 연계 예정',
        tone: 'warning',
      },
      {
        id: 'analytics-report.ccp-trend-report',
        path: '/coming-soon/analytics-report/ccp-trend-report',
        label: 'CCP 트렌드 분석 및 이상징후 리포트',
        status: 'coming-soon',
        description:
          'CCP 데이터를 기간별로 분석해 이상 패턴과 리스크를 요약합니다.',
        objective: '반복되는 이탈 징후를 선제적으로 발견해 재발을 줄입니다.',
        highlight: '자동 리포트 생성 및 다운로드 기능 예정',
        tone: 'warning',
      },
    ],
  },
  {
    id: 'system-settings',
    label: '시스템 설정',
    description:
      '사용자, 권한, CCP 기준값 같은 운영 기준을 관리하는 관리자 영역입니다.',
    summary: '운영 규칙과 기준값을 체계적으로 유지해 데이터 신뢰성을 높입니다.',
    tone: 'info',
    items: [
      {
        id: 'system-settings.user-management',
        path: '/system-settings/users',
        label: '사용자관리',
        status: 'ready',
        description:
          '현장과 관리 조직의 사용자 계정을 역할 기반으로 관리합니다.',
        objective: '업무별 접근 권한과 책임 범위를 명확하게 유지합니다.',
        highlight: '역할 기반 접근 제어와 승인 체계 연동 예정',
        tone: 'info',
        allowedRoles: adminRoles,
      },
      {
        id: 'system-settings.authorization-management',
        path: '/coming-soon/system-settings/authorization-management',
        label: '권한관리',
        status: 'coming-soon',
        description: '메뉴 접근, 등록, 승인 같은 권한 정책을 관리합니다.',
        objective: '업무 권한 오배정을 줄이고 관리자 운영 부담을 낮춥니다.',
        highlight: '권한 템플릿과 감사 로그 연결 예정',
        tone: 'info',
        allowedRoles: adminRoles,
      },
    ],
  },
];

export function getAllMenuItems(): MenuItem[] {
  return menuCategories.flatMap((category) => category.items);
}

function hasRoleAccess(item: MenuItem, roles: string[]): boolean {
  if (!item.allowedRoles || item.allowedRoles.length === 0) {
    return true;
  }

  return item.allowedRoles.some((role) => roles.includes(role));
}

function getRoleCacheKey(roles: string[]): string {
  if (roles.length === 0) {
    return '__no_roles__';
  }

  return [...roles].sort().join('|');
}

export function filterMenuCategoriesByRoles(roles: string[]): MenuCategory[] {
  const cacheKey = getRoleCacheKey(roles);
  const cachedCategories = filteredMenuCategoryCache.get(cacheKey);

  if (cachedCategories) {
    return cachedCategories;
  }

  const filteredCategories = menuCategories.flatMap((category) => {
    const visibleItems = category.items.filter((item) =>
      hasRoleAccess(item, roles),
    );

    if (visibleItems.length === 0) {
      return [];
    }

    if (visibleItems.length === category.items.length) {
      return [category];
    }

    return [
      {
        ...category,
        items: visibleItems,
      },
    ];
  });

  filteredMenuCategoryCache.set(cacheKey, filteredCategories);

  return filteredCategories;
}

export function findMenuCategoryById(categoryId: string): MenuCategory | null {
  return menuCategories.find((category) => category.id === categoryId) ?? null;
}

export function findCategoryByItemId(itemId: string): MenuCategory | null {
  return (
    menuCategories.find((category) =>
      category.items.some((item) => item.id === itemId),
    ) ?? null
  );
}

export function findMenuItemById(itemId: string): MenuItem | null {
  for (const category of menuCategories) {
    const found = category.items.find((item) => item.id === itemId);
    if (found) {
      return found;
    }
  }

  return null;
}

export function getRoutePathFromMenuItemId(itemId: string): string {
  const item = findMenuItemById(itemId);

  return item?.path ?? '/coming-soon/misc/unknown';
}

export function findMenuItemByPath(pathname: string): MenuItem | null {
  return getAllMenuItems().find((item) => item.path === pathname) ?? null;
}

export function findMenuSelectionByPath(
  pathname: string,
): { categoryId: string; itemId: string } | null {
  const item = findMenuItemByPath(pathname);

  if (!item) {
    return null;
  }

  const category = findCategoryByItemId(item.id);

  return {
    categoryId: category?.id ?? menuCategories[0]?.id ?? 'smart-monitoring',
    itemId: item.id,
  };
}
