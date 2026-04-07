import { apiClient } from '../../../util/axios';
import {
  cloneDocumentFormData,
  cloneJournalRecord,
  cloneTemplateDetail,
  cloneTemplateLibrary,
  createJournalDraft,
  getCurrentTemplateVersion,
  initialEditorContent,
  initialTemplateLibrary,
  initialTemplateSchema,
  toPublishedTemplateContext,
  type DemoJournalRecord,
  type DemoSaveJournalPayload,
  type DemoTemplateDetail,
  type DemoTemplateSummary,
  type DemoTemplateVersion,
} from '../types/documentTemplateDemo';

export const documentTemplateQueryKeys = {
  all: ['document-template-demo'] as const,
  templates: () => [...documentTemplateQueryKeys.all, 'templates'] as const,
  template: (templateId: string) =>
    [...documentTemplateQueryKeys.templates(), templateId] as const,
  publishedTemplates: () =>
    [...documentTemplateQueryKeys.all, 'published-templates'] as const,
  journal: (templateId: string) =>
    [...documentTemplateQueryKeys.all, 'journal', templateId] as const,
};

const templateLibrary: DemoTemplateDetail[] = cloneTemplateLibrary(
  initialTemplateLibrary,
);
const journalRecords = new Map<string, DemoJournalRecord>();
let templateSequence = templateLibrary.length + 1;

function createMockResponse<T>(payload: T): Promise<T> {
  void apiClient.defaults.baseURL;
  return Promise.resolve(structuredClone(payload));
}

function summarizeTemplate(template: DemoTemplateDetail): DemoTemplateSummary {
  return {
    id: template.id,
    name: template.name,
    summary: template.summary,
    description: template.description,
    category: template.category,
    libraryStatus: template.libraryStatus,
    currentVersionId: template.currentVersionId,
    currentVersionLabel: template.currentVersionLabel,
    publishedVersionId: template.publishedVersionId,
    publishedVersionLabel: template.publishedVersionLabel,
    lastEditedAt: template.lastEditedAt,
  };
}

function getTemplateIndex(templateId: string): number {
  return templateLibrary.findIndex((template) => template.id === templateId);
}

function getTemplateOrThrow(templateId: string): DemoTemplateDetail {
  const template = templateLibrary.find((item) => item.id === templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return template;
}

function getVersionNumber(version: DemoTemplateVersion): number {
  const matched = version.label.match(/v(\d+)\.(\d+)/i);

  if (!matched) {
    return 0;
  }

  return Number(matched[1]);
}

function refreshTemplateMetadata(
  template: DemoTemplateDetail,
): DemoTemplateDetail {
  const currentVersion =
    template.versions.find(
      (version) => version.id === template.currentVersionId,
    ) ?? template.versions[0];
  const publishedVersion =
    template.versions.find((version) => version.status === 'published') ?? null;
  const hasDraft = template.versions.some(
    (version) => version.status === 'draft',
  );

  return {
    ...template,
    currentVersionId: currentVersion.id,
    currentVersionLabel: currentVersion.label,
    publishedVersionId: publishedVersion?.id ?? null,
    publishedVersionLabel: publishedVersion?.label ?? null,
    libraryStatus: publishedVersion
      ? hasDraft
        ? 'published-with-draft'
        : 'published'
      : 'draft-only',
    lastEditedAt: currentVersion.createdAt,
  };
}

function replaceTemplate(nextTemplate: DemoTemplateDetail): DemoTemplateDetail {
  const template = refreshTemplateMetadata(cloneTemplateDetail(nextTemplate));
  const index = getTemplateIndex(template.id);

  if (index === -1) {
    templateLibrary.unshift(template);
  } else {
    templateLibrary[index] = template;
  }

  return template;
}

function createInitialTemplate(): DemoTemplateDetail {
  const templateId = `template-custom-${templateSequence}`;
  const versionId = `${templateId}-v1`;
  const createdAt = `2026-04-06T1${templateSequence}:00:00.000Z`;
  const templateNumber = templateSequence;

  templateSequence += 1;

  return {
    id: templateId,
    name: `CCP 신규 템플릿 ${templateNumber}`,
    summary: '신규 CCP 점검 템플릿 초안입니다.',
    description:
      'AI 초안과 관리자의 수동 편집을 거쳐 게시할 신규 템플릿입니다.',
    category: 'CCP 관리',
    libraryStatus: 'draft-only',
    currentVersionId: versionId,
    currentVersionLabel: 'Draft v1.0',
    publishedVersionId: null,
    publishedVersionLabel: null,
    lastEditedAt: createdAt,
    versions: [
      {
        id: versionId,
        label: 'Draft v1.0',
        summary: '신규 템플릿 초안',
        status: 'draft',
        schema: {
          ...structuredClone(initialTemplateSchema),
          id: `${templateId}-schema`,
          name: `신규 템플릿 ${templateNumber}`,
          summary: '신규 템플릿 초안 스키마',
        },
        editorContent: initialEditorContent,
        createdAt,
        publishedAt: null,
      },
    ],
  };
}

export function listTemplateSummaries(): Promise<DemoTemplateSummary[]> {
  return createMockResponse(templateLibrary.map(summarizeTemplate));
}

export function getTemplateDetail(
  templateId: string,
): Promise<DemoTemplateDetail> {
  return createMockResponse(getTemplateOrThrow(templateId));
}

export function createTemplate(): Promise<DemoTemplateDetail> {
  const created = replaceTemplate(createInitialTemplate());

  return createMockResponse(created);
}

export function saveTemplate(
  template: DemoTemplateDetail,
): Promise<DemoTemplateDetail> {
  const nextTemplate = replaceTemplate(template);

  return createMockResponse(nextTemplate);
}

export function createTemplateVersion(
  templateId: string,
): Promise<DemoTemplateDetail> {
  const template = getTemplateOrThrow(templateId);
  const baseVersion = getCurrentTemplateVersion(template);
  const nextVersionNumber =
    Math.max(...template.versions.map(getVersionNumber)) + 1;
  const versionId = `${templateId}-v${nextVersionNumber}`;
  const createdAt = `2026-04-06T1${nextVersionNumber}:30:00.000Z`;
  const nextVersion: DemoTemplateVersion = {
    ...structuredClone(baseVersion),
    id: versionId,
    label: `Draft v${nextVersionNumber}.0`,
    summary: `${baseVersion.summary} 복제본`,
    status: 'draft',
    createdAt,
    publishedAt: null,
  };

  const saved = replaceTemplate({
    ...template,
    currentVersionId: nextVersion.id,
    currentVersionLabel: nextVersion.label,
    lastEditedAt: createdAt,
    versions: [nextVersion, ...template.versions],
  });

  return createMockResponse(saved);
}

export function publishTemplateVersion(
  templateId: string,
  versionId: string,
): Promise<DemoTemplateDetail> {
  const template = getTemplateOrThrow(templateId);
  const publishedAt = '2026-04-06T15:00:00.000Z';

  const saved = replaceTemplate({
    ...template,
    currentVersionId: versionId,
    versions: template.versions.map((version) => {
      if (version.id === versionId) {
        return {
          ...version,
          status: 'published',
          label: version.label.startsWith('게시 버전')
            ? version.label
            : version.label.replace('Draft', '게시 버전'),
          publishedAt,
        };
      }

      if (version.status === 'published') {
        return {
          ...version,
          status: 'archived',
        };
      }

      return version;
    }),
  });

  return createMockResponse(saved);
}

export function listPublishedTemplateContexts() {
  return createMockResponse(
    templateLibrary
      .map((template) => toPublishedTemplateContext(template))
      .filter(
        (context): context is NonNullable<typeof context> => context !== null,
      ),
  );
}

export function getJournalRecord(
  templateId: string,
): Promise<DemoJournalRecord> {
  const existingRecord = journalRecords.get(templateId);

  if (existingRecord) {
    return createMockResponse(existingRecord);
  }

  const template = getTemplateOrThrow(templateId);
  const context = toPublishedTemplateContext(template);

  if (!context) {
    throw new Error(`Published template not found: ${templateId}`);
  }

  const nextRecord = createJournalDraft(context);
  journalRecords.set(templateId, nextRecord);

  return createMockResponse(nextRecord);
}

export function saveJournalDraft(
  payload: DemoSaveJournalPayload,
): Promise<DemoJournalRecord> {
  const template = getTemplateOrThrow(payload.templateId);
  const version =
    template.versions.find((item) => item.id === payload.templateVersionId) ??
    getCurrentTemplateVersion(template);
  const existingRecord = journalRecords.get(payload.templateId);

  const nextRecord: DemoJournalRecord = {
    id: existingRecord?.id ?? `journal-${payload.templateId}`,
    templateId: payload.templateId,
    templateName: template.name,
    templateVersionId: version.id,
    templateVersionLabel: version.label,
    status: 'draft',
    updatedAt: '2026-04-06T16:00:00.000Z',
    submittedAt: null,
    documentData: cloneDocumentFormData(payload.documentData),
  };

  journalRecords.set(payload.templateId, nextRecord);

  return createMockResponse(nextRecord);
}

export function submitJournal(
  payload: DemoSaveJournalPayload,
): Promise<DemoJournalRecord> {
  const template = getTemplateOrThrow(payload.templateId);
  const version =
    template.versions.find((item) => item.id === payload.templateVersionId) ??
    getCurrentTemplateVersion(template);
  const existingRecord = journalRecords.get(payload.templateId);

  const nextRecord: DemoJournalRecord = {
    id: existingRecord?.id ?? `journal-${payload.templateId}`,
    templateId: payload.templateId,
    templateName: template.name,
    templateVersionId: version.id,
    templateVersionLabel: version.label,
    status: 'submitted',
    updatedAt: '2026-04-06T16:30:00.000Z',
    submittedAt: '2026-04-06T16:30:00.000Z',
    documentData: cloneDocumentFormData(payload.documentData),
  };

  journalRecords.set(payload.templateId, nextRecord);

  return createMockResponse(cloneJournalRecord(nextRecord));
}
