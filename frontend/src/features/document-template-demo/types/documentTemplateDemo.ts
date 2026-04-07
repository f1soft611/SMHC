export type DemoBlockType = 'heading' | 'meta' | 'checklist' | 'table' | 'note';

export type DemoTemplateVersionStatus = 'draft' | 'published' | 'archived';

export type DemoTemplateLibraryStatus =
  | 'draft-only'
  | 'published'
  | 'published-with-draft';

export type DemoJournalStatus = 'draft' | 'submitted';

export interface DemoTemplateBlock {
  id: string;
  type: DemoBlockType;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
}

export interface DemoTemplateSection {
  id: string;
  title: string;
  description: string;
  blocks: DemoTemplateBlock[];
}

export interface DemoTemplateSchema {
  id: string;
  name: string;
  summary: string;
  sections: DemoTemplateSection[];
}

export interface DemoTemplateVersion {
  id: string;
  label: string;
  summary: string;
  status: DemoTemplateVersionStatus;
  schema: DemoTemplateSchema;
  editorContent: string;
  createdAt: string;
  publishedAt: string | null;
}

export interface DemoTemplateSummary {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: string;
  libraryStatus: DemoTemplateLibraryStatus;
  currentVersionId: string;
  currentVersionLabel: string;
  publishedVersionId: string | null;
  publishedVersionLabel: string | null;
  lastEditedAt: string;
}

export interface DemoTemplateDetail extends DemoTemplateSummary {
  versions: DemoTemplateVersion[];
}

export interface DemoPublishedTemplateContext {
  templateId: string;
  templateName: string;
  templateSummary: string;
  templateVersionId: string;
  templateVersionLabel: string;
  schema: DemoTemplateSchema;
}

export type SuitabilityValue = '적합' | '부적합' | null;

export interface MonitoringRow {
  id: string;
  workDate: string;
  heatingStartTime: string;
  heatingTemperature: string;
  heatingEndTime: string;
  postHeatingSurfaceTemperature: string;
  suitability: SuitabilityValue;
}

export interface CorrectiveActionRow {
  id: string;
  deviationDetail: string;
  actionResult: string;
  actionTaken: boolean;
  reportedToManager: boolean;
}

export interface DemoDocumentFormData {
  documentTitle: string;
  processLabel: string;
  period: string;
  inspector: string;
  heatingTemperatureCriteria: string;
  heatingTimeCriteria: string;
  coreTemperatureCriteria: string;
  frequency: string;
  monitoringMethodText: string;
  correctiveMethodText: string;
  monitoringRows: MonitoringRow[];
  correctiveRows: CorrectiveActionRow[];
}

export interface DemoJournalRecord {
  id: string;
  templateId: string;
  templateName: string;
  templateVersionId: string;
  templateVersionLabel: string;
  status: DemoJournalStatus;
  updatedAt: string;
  submittedAt: string | null;
  documentData: DemoDocumentFormData;
}

export interface DemoSaveJournalPayload {
  templateId: string;
  templateVersionId: string;
  documentData: DemoDocumentFormData;
}

export const initialTemplateSchema: DemoTemplateSchema = {
  id: 'template-prerequisite-check-demo',
  name: '선행요건 점검 일지 템플릿',
  summary:
    'AI 초안 생성 이후 관리자가 수정·확정하는 흐름을 시연하기 위한 데모 템플릿입니다.',
  sections: [
    {
      id: 'section-overview',
      title: '기본정보',
      description: '점검일자, 작업조, 점검자를 기록하는 메타 구간입니다.',
      blocks: [
        {
          id: 'block-title',
          type: 'heading',
          label: '문서 제목',
          description: '문서 상단 제목과 안내 문구를 관리합니다.',
          required: true,
          placeholder: '예: 선행요건 점검 일지',
        },
        {
          id: 'block-meta',
          type: 'meta',
          label: '점검 메타정보',
          description: '점검일자, 작업조, 점검자를 입력하는 영역입니다.',
          required: true,
        },
      ],
    },
    {
      id: 'section-checklist',
      title: '점검항목',
      description: '체크리스트와 기록 테이블을 함께 사용하는 핵심 구간입니다.',
      blocks: [
        {
          id: 'block-checklist',
          type: 'checklist',
          label: '현장 체크리스트',
          description: '위생, 세척, 보관 조건을 체크리스트 형태로 점검합니다.',
          required: true,
        },
        {
          id: 'block-table',
          type: 'table',
          label: '점검 기록표',
          description: '점검기준, 결과, 개선조치를 표 형태로 기록합니다.',
          required: true,
        },
      ],
    },
    {
      id: 'section-note',
      title: '비고 및 후속조치',
      description: '점검 결과에 대한 추가 메모와 후속조치를 기록합니다.',
      blocks: [
        {
          id: 'block-note',
          type: 'note',
          label: '비고',
          description: '비고와 후속조치를 서술형으로 기록합니다.',
          required: false,
          placeholder: '추가 확인이 필요한 항목이나 개선조치를 작성합니다.',
        },
      ],
    },
  ],
};

export const initialEditorContent = `
  <h1>선행요건 점검 일지</h1>
  <p>AI 초안 기반 템플릿을 관리자가 수정하는 화면을 시연하기 위한 데모 문서입니다.</p>
  <h2>기본정보</h2>
  <p><strong>점검일자</strong> : 2026-04-06 / <strong>작업조</strong> : 오전조 / <strong>점검자</strong> : 품질관리팀</p>
  <h2>현장 체크리스트</h2>
  <ul data-type="taskList">
    <li data-type="taskItem" data-checked="true"><p>위생복 및 장갑 착용 상태 확인</p></li>
    <li data-type="taskItem" data-checked="false"><p>세척·소독 설비 작동 상태 확인</p></li>
    <li data-type="taskItem" data-checked="false"><p>원재료 보관 온도 확인</p></li>
  </ul>
  <h2>점검 기록표</h2>
  <table>
    <tbody>
      <tr>
        <th>점검항목</th>
        <th>기준</th>
        <th>결과</th>
        <th>개선조치</th>
      </tr>
      <tr>
        <td>세척 탱크 온도</td>
        <td>75℃ 이상</td>
        <td>74℃</td>
        <td>재가열 후 재점검</td>
      </tr>
      <tr>
        <td>작업장 습도</td>
        <td>60% 이하</td>
        <td>58%</td>
        <td>정상</td>
      </tr>
    </tbody>
  </table>
  <h2>비고</h2>
  <p>세척 탱크 초기 측정값이 기준보다 낮아 재점검을 진행했습니다.</p>
`;

export const initialMonitoringMethodText =
  '▶ 가열온도는 기기에 표시된 온도계를 이용하여 확인합니다.\n▶ 가열시간은 시작시간과 종료시간을 기록하여 기준 이상 여부를 확인합니다.\n▶ 가열 후 표면온도는 제품 접선 부위 온도계를 이용하여 측정합니다.';

export const initialCorrectiveMethodText =
  '1. 가열온도 또는 가열시간 기준 이탈 시 즉시 작업을 중단하고 재가열 여부를 판단합니다.\n2. 이탈사항과 개선조치 내용을 일지에 기록하고 HACCP 담당자에게 보고합니다.\n3. 설비 이상일 경우 정비 후 동일 배치 재점검을 수행합니다.';

export const initialDocumentFormData: DemoDocumentFormData = {
  documentTitle: '중요관리점(CCP-1B) 모니터링일지',
  processLabel: '[가열(멸팅)공정]',
  period: '2026-04-03',
  inspector: '이대리',
  heatingTemperatureCriteria: '50~55℃',
  heatingTimeCriteria: '6시간 이상',
  coreTemperatureCriteria: '40~55℃',
  frequency: '매 배치시마다',
  monitoringMethodText: initialMonitoringMethodText,
  correctiveMethodText: initialCorrectiveMethodText,
  monitoringRows: [
    {
      id: 'monitoring-row-1',
      workDate: '04-03',
      heatingStartTime: '08:00',
      heatingTemperature: '52',
      heatingEndTime: '14:10',
      postHeatingSurfaceTemperature: '49',
      suitability: '적합',
    },
  ],
  correctiveRows: [
    {
      id: 'corrective-row-1',
      deviationDetail: '세척 탱크 초기 온도 기준 미달',
      actionResult: '재가열 후 정상 범위 확인',
      actionTaken: true,
      reportedToManager: false,
    },
  ],
};

const coolingTemplateSchema: DemoTemplateSchema = {
  id: 'template-ccp-cooling-schema',
  name: 'CCP 냉각공정 템플릿',
  summary: '냉각공정 점검일지 초안을 관리하기 위한 템플릿 스키마입니다.',
  sections: [
    {
      id: 'cooling-overview',
      title: '기본정보',
      description: '냉각공정 점검의 기본 메타를 입력합니다.',
      blocks: [
        {
          id: 'cooling-title',
          type: 'heading',
          label: '문서 제목',
          description: '냉각공정 점검일지 제목을 관리합니다.',
          required: true,
          placeholder: '예: 중요관리점(CCP-2) 냉각공정 점검일지',
        },
        {
          id: 'cooling-meta',
          type: 'meta',
          label: '공정 메타 정보',
          description: '점검일자, 담당자, 냉각설비를 기록합니다.',
          required: true,
        },
      ],
    },
    {
      id: 'cooling-records',
      title: '냉각 기록',
      description: '냉각시간과 온도 편차를 기록합니다.',
      blocks: [
        {
          id: 'cooling-table',
          type: 'table',
          label: '냉각 기록표',
          description: '냉각시간, 종료온도, 적합 여부를 표로 기록합니다.',
          required: true,
        },
        {
          id: 'cooling-note',
          type: 'note',
          label: '비고',
          description: '이탈 원인과 후속조치를 기록합니다.',
          required: false,
          placeholder: '설비 이상 또는 재점검 사유를 작성합니다.',
        },
      ],
    },
  ],
};

const coolingEditorContent = `
  <h1>중요관리점(CCP-2) 냉각공정 점검일지</h1>
  <p>냉각 공정의 기준 온도 도달 여부와 조치 내역을 관리하는 템플릿입니다.</p>
  <h2>기본정보</h2>
  <p><strong>점검일자</strong> : 2026-04-06 / <strong>설비</strong> : 급속 냉각기 2호 / <strong>점검자</strong> : 품질관리팀</p>
  <h2>냉각 기록</h2>
  <table>
    <tbody>
      <tr>
        <th>배치</th>
        <th>시작 온도</th>
        <th>종료 온도</th>
        <th>적합 여부</th>
      </tr>
      <tr>
        <td>B-240406-1</td>
        <td>58℃</td>
        <td>12℃</td>
        <td>적합</td>
      </tr>
    </tbody>
  </table>
`;

export const initialTemplateLibrary: DemoTemplateDetail[] = [
  {
    id: 'template-ccp-heating',
    name: 'CCP 가열공정 템플릿',
    summary: '가열공정 점검일지를 작성하기 위한 대표 템플릿입니다.',
    description:
      '현장 점검자가 템플릿 구조를 바꾸지 않고 측정값과 조치 결과만 입력하도록 설계된 템플릿입니다.',
    category: 'CCP 관리',
    libraryStatus: 'published-with-draft',
    currentVersionId: 'template-ccp-heating-v2',
    currentVersionLabel: 'Draft v2.0',
    publishedVersionId: 'template-ccp-heating-v1',
    publishedVersionLabel: '게시 버전 v1.0',
    lastEditedAt: '2026-04-06T09:30:00.000Z',
    versions: [
      {
        id: 'template-ccp-heating-v1',
        label: '게시 버전 v1.0',
        summary: '현행 가열공정 점검일지에 맞춘 게시 버전입니다.',
        status: 'published',
        schema: initialTemplateSchema,
        editorContent: initialEditorContent,
        createdAt: '2026-04-03T08:30:00.000Z',
        publishedAt: '2026-04-04T10:00:00.000Z',
      },
      {
        id: 'template-ccp-heating-v2',
        label: 'Draft v2.0',
        summary: 'AI 초안 기반으로 보완 중인 개정 템플릿입니다.',
        status: 'draft',
        schema: {
          ...initialTemplateSchema,
          summary: '가열공정 개정안 템플릿 초안입니다.',
          sections: initialTemplateSchema.sections.map((section) => ({
            ...section,
            blocks: section.blocks.map((block) =>
              block.id === 'block-note'
                ? {
                    ...block,
                    label: '비고 및 특이사항',
                    description:
                      '점검 중 특이사항과 재점검 메모를 함께 기록합니다.',
                  }
                : block,
            ),
          })),
        },
        editorContent: `${initialEditorContent}<p>개정안에는 제출 후 수정 잠금 정책 안내를 추가합니다.</p>`,
        createdAt: '2026-04-06T09:30:00.000Z',
        publishedAt: null,
      },
    ],
  },
  {
    id: 'template-ccp-cooling',
    name: 'CCP 냉각공정 템플릿',
    summary: '냉각공정 점검일지 신규 도입을 위한 초안 템플릿입니다.',
    description:
      '냉각 공정용 일지를 추가하기 위한 템플릿 초안으로 아직 게시되지 않았습니다.',
    category: 'CCP 관리',
    libraryStatus: 'draft-only',
    currentVersionId: 'template-ccp-cooling-v1',
    currentVersionLabel: 'Draft v1.0',
    publishedVersionId: null,
    publishedVersionLabel: null,
    lastEditedAt: '2026-04-06T11:00:00.000Z',
    versions: [
      {
        id: 'template-ccp-cooling-v1',
        label: 'Draft v1.0',
        summary: '냉각공정 템플릿 최초 초안입니다.',
        status: 'draft',
        schema: coolingTemplateSchema,
        editorContent: coolingEditorContent,
        createdAt: '2026-04-06T11:00:00.000Z',
        publishedAt: null,
      },
    ],
  },
];

export function cloneTemplateSchema(
  schema: DemoTemplateSchema,
): DemoTemplateSchema {
  return structuredClone(schema);
}

export function cloneTemplateDetail(
  detail: DemoTemplateDetail,
): DemoTemplateDetail {
  return structuredClone(detail);
}

export function cloneTemplateLibrary(
  library: DemoTemplateDetail[],
): DemoTemplateDetail[] {
  return structuredClone(library);
}

export function cloneDocumentFormData(
  formData: DemoDocumentFormData,
): DemoDocumentFormData {
  return structuredClone(formData);
}

export function cloneJournalRecord(
  journal: DemoJournalRecord,
): DemoJournalRecord {
  return structuredClone(journal);
}

export function findTemplateVersionById(
  template: DemoTemplateDetail,
  versionId: string,
): DemoTemplateVersion | null {
  return template.versions.find((version) => version.id === versionId) ?? null;
}

export function getCurrentTemplateVersion(
  template: DemoTemplateDetail,
): DemoTemplateVersion {
  return (
    findTemplateVersionById(template, template.currentVersionId) ??
    template.versions[0]
  );
}

export function getPublishedTemplateVersion(
  template: DemoTemplateDetail,
): DemoTemplateVersion | null {
  if (!template.publishedVersionId) {
    return null;
  }

  return findTemplateVersionById(template, template.publishedVersionId);
}

export function toPublishedTemplateContext(
  template: DemoTemplateDetail,
): DemoPublishedTemplateContext | null {
  const publishedVersion = getPublishedTemplateVersion(template);

  if (!publishedVersion) {
    return null;
  }

  return {
    templateId: template.id,
    templateName: template.name,
    templateSummary: template.summary,
    templateVersionId: publishedVersion.id,
    templateVersionLabel: publishedVersion.label,
    schema: cloneTemplateSchema(publishedVersion.schema),
  };
}

export function createJournalDraft(
  context: DemoPublishedTemplateContext,
): DemoJournalRecord {
  return {
    id: `journal-${context.templateId}`,
    templateId: context.templateId,
    templateName: context.templateName,
    templateVersionId: context.templateVersionId,
    templateVersionLabel: context.templateVersionLabel,
    status: 'draft',
    updatedAt: '2026-04-06T13:00:00.000Z',
    submittedAt: null,
    documentData: cloneDocumentFormData(initialDocumentFormData),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function convertPlainTextToHtml(value: string): string {
  const normalized = value.replaceAll('\r\n', '\n');

  if (normalized === '') {
    return '';
  }

  return normalized
    .split('\n')
    .map((line) => `<p>${line === '' ? '<br />' : escapeHtml(line)}</p>`)
    .join('');
}

export function createDocumentPreviewHtml(data: DemoDocumentFormData): string {
  const monitoringMethodHtml = convertPlainTextToHtml(
    data.monitoringMethodText,
  );
  const correctiveMethodHtml = convertPlainTextToHtml(
    data.correctiveMethodText,
  );
  const monitoringRowsHtml = data.monitoringRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.workDate)}</td>
          <td>${escapeHtml(row.heatingStartTime)}</td>
          <td>${escapeHtml(row.heatingTemperature)}</td>
          <td>${escapeHtml(row.heatingEndTime)}</td>
          <td>${escapeHtml(row.postHeatingSurfaceTemperature)}</td>
          <td style="text-align:center;"><input type="checkbox" ${row.suitability === '적합' ? 'checked' : ''} disabled /></td>
          <td style="text-align:center;"><input type="checkbox" ${row.suitability === '부적합' ? 'checked' : ''} disabled /></td>
        </tr>
      `,
    )
    .join('');

  const correctiveRowsHtml = data.correctiveRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.deviationDetail)}</td>
          <td>${escapeHtml(row.actionResult)}</td>
          <td style="text-align:center;"><input type="checkbox" ${row.actionTaken ? 'checked' : ''} disabled /></td>
          <td style="text-align:center;"><input type="checkbox" ${row.reportedToManager ? 'checked' : ''} disabled /></td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="padding:6px;background:#fff;color:#111;font-family:Pretendard, sans-serif;">
      <table style="width:100%;border-collapse:collapse;border:2px solid #1f1f1f;table-layout:fixed;">
        <tbody>
          <tr>
            <th colspan="7" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:18px 12px;text-align:center;">
              <div style="font-size:20px;font-weight:800;">${escapeHtml(data.documentTitle)}</div>
              <div style="font-size:14px;color:#2457b7;margin-top:4px;">${escapeHtml(data.processLabel)}</div>
            </th>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">작성 기간</th>
            <td colspan="3" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.period)}</td>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">점검자</th>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.inspector)}</td>
          </tr>
          <tr>
            <th rowspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">한계기준</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열온도(℃)</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(분)</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">중심온도</th>
          </tr>
          <tr>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.heatingTemperatureCriteria)}</td>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.heatingTimeCriteria)}</td>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.coreTemperatureCriteria)}</td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">주기</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;text-align:center;">${escapeHtml(data.frequency)}</td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">방법</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;">${monitoringMethodHtml}</td>
          </tr>
          <tr>
            <td colspan="7" style="padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <thead>
                  <tr>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">일</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(시작)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열온도(℃)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(종료)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열후 표면온도(℃)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">적합</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">부적합</th>
                  </tr>
                </thead>
                <tbody>${monitoringRowsHtml}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">개선조치 방법</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;">${correctiveMethodHtml}</td>
          </tr>
          <tr>
            <td colspan="7" style="padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <thead>
                  <tr>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">한계 기준 이탈내용</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">개선조치 및 결과</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">조치</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">보고</th>
                  </tr>
                </thead>
                <tbody>${correctiveRowsHtml}</tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

export function createInteractiveDocumentHtml(
  data: DemoDocumentFormData,
): string {
  const monitoringMethodHtml = convertPlainTextToHtml(
    data.monitoringMethodText,
  );
  const correctiveMethodHtml = convertPlainTextToHtml(
    data.correctiveMethodText,
  );
  const monitoringRowsHtml = data.monitoringRows
    .map(
      (row) => `
        <tr>
          <td><input type="text" value="${escapeHtml(row.workDate)}" /></td>
          <td><input type="text" value="${escapeHtml(row.heatingStartTime)}" /></td>
          <td><input type="text" value="${escapeHtml(row.heatingTemperature)}" /></td>
          <td><input type="text" value="${escapeHtml(row.heatingEndTime)}" /></td>
          <td><input type="text" value="${escapeHtml(row.postHeatingSurfaceTemperature)}" /></td>
          <td style="text-align:center;"><input type="checkbox" ${row.suitability === '적합' ? 'checked' : ''} /></td>
          <td style="text-align:center;"><input type="checkbox" ${row.suitability === '부적합' ? 'checked' : ''} /></td>
        </tr>
      `,
    )
    .join('');

  const correctiveRowsHtml = data.correctiveRows
    .map(
      (row) => `
        <tr>
          <td><textarea rows="3">${escapeHtml(row.deviationDetail)}</textarea></td>
          <td><textarea rows="3">${escapeHtml(row.actionResult)}</textarea></td>
          <td style="text-align:center;"><input type="checkbox" ${row.actionTaken ? 'checked' : ''} /></td>
          <td style="text-align:center;"><input type="checkbox" ${row.reportedToManager ? 'checked' : ''} /></td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="padding:6px;background:#fff;color:#111;font-family:Pretendard, sans-serif;">
      <table style="width:100%;border-collapse:collapse;border:2px solid #1f1f1f;table-layout:fixed;">
        <tbody>
          <tr>
            <th colspan="7" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:18px 12px;text-align:center;">
              <div style="font-size:20px;font-weight:800;">${escapeHtml(data.documentTitle)}</div>
              <div style="font-size:14px;color:#2457b7;margin-top:4px;">${escapeHtml(data.processLabel)}</div>
            </th>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">작성 기간</th>
            <td colspan="3" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.period)}" style="width:100%;text-align:center;" /></td>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">점검자</th>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.inspector)}" style="width:100%;text-align:center;" /></td>
          </tr>
          <tr>
            <th rowspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">한계기준</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열온도(℃)</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(분)</th>
            <th colspan="2" style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">중심온도</th>
          </tr>
          <tr>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.heatingTemperatureCriteria)}" style="width:100%;text-align:center;" /></td>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.heatingTimeCriteria)}" style="width:100%;text-align:center;" /></td>
            <td colspan="2" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.coreTemperatureCriteria)}" style="width:100%;text-align:center;" /></td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">주기</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;"><input type="text" value="${escapeHtml(data.frequency)}" style="width:100%;text-align:center;" /></td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">방법</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;">${monitoringMethodHtml}</td>
          </tr>
          <tr>
            <td colspan="7" style="padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <thead>
                  <tr>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">일</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(시작)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열온도(℃)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열시간(종료)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">가열후 표면온도(℃)</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">적합</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">부적합</th>
                  </tr>
                </thead>
                <tbody>${monitoringRowsHtml}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">개선조치 방법</th>
            <td colspan="6" style="border:1px solid #1f1f1f;padding:10px;">${correctiveMethodHtml}</td>
          </tr>
          <tr>
            <td colspan="7" style="padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <thead>
                  <tr>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">한계 기준 이탈내용</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">개선조치 및 결과</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">조치</th>
                    <th style="border:1px solid #1f1f1f;background:#cfe0f1;padding:10px;">보고</th>
                  </tr>
                </thead>
                <tbody>${correctiveRowsHtml}</tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

export function findTemplateBlockById(
  schema: DemoTemplateSchema,
  blockId: string,
): DemoTemplateBlock | null {
  for (const section of schema.sections) {
    const block = section.blocks.find((item) => item.id === blockId);

    if (block) {
      return block;
    }
  }

  return null;
}
