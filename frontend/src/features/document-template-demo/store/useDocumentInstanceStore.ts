import { create } from 'zustand';
import {
  cloneDocumentFormData,
  createJournalDraft,
  initialDocumentFormData,
  initialTemplateLibrary,
  toPublishedTemplateContext,
  type CorrectiveActionRow,
  type DemoDocumentFormData,
  type DemoJournalRecord,
  type DemoJournalStatus,
  type MonitoringRow,
  type SuitabilityValue,
} from '../types/documentTemplateDemo';

interface DocumentInstanceState {
  journalId: string | null;
  selectedTemplateId: string | null;
  selectedTemplateName: string;
  selectedTemplateVersionLabel: string;
  documentStatus: DemoJournalStatus;
  updatedAt: string | null;
  submittedAt: string | null;
  documentData: DemoDocumentFormData;
  hydrateJournal: (journal: DemoJournalRecord) => void;
  updateDocumentField: (
    field: Exclude<
      keyof DemoDocumentFormData,
      | 'monitoringRows'
      | 'correctiveRows'
      | 'monitoringMethodText'
      | 'correctiveMethodText'
    >,
    value: string,
  ) => void;
  updateRichTextField: (
    field: 'monitoringMethodText' | 'correctiveMethodText',
    value: string,
  ) => void;
  updateMonitoringRow: (
    rowId: string,
    field: Exclude<keyof MonitoringRow, 'id'>,
    value: string | SuitabilityValue,
  ) => void;
  addMonitoringRow: () => void;
  removeMonitoringRow: (rowId: string) => void;
  updateCorrectiveRow: (
    rowId: string,
    field: Exclude<keyof CorrectiveActionRow, 'id'>,
    value: string | boolean,
  ) => void;
  addCorrectiveRow: () => void;
  removeCorrectiveRow: (rowId: string) => void;
  markDraftSaved: (updatedAt: string) => void;
  markSubmitted: (submittedAt: string) => void;
  resetDocument: () => void;
}

function cloneInitialDocumentFormData(): DemoDocumentFormData {
  return cloneDocumentFormData(initialDocumentFormData);
}

const defaultPublishedContext = toPublishedTemplateContext(
  initialTemplateLibrary[0],
);
const defaultJournal =
  defaultPublishedContext === null
    ? null
    : createJournalDraft(defaultPublishedContext);

let monitoringRowSequence = initialDocumentFormData.monitoringRows.length + 1;
let correctiveRowSequence = initialDocumentFormData.correctiveRows.length + 1;

export const useDocumentInstanceStore = create<DocumentInstanceState>(
  (set) => ({
    journalId: defaultJournal?.id ?? null,
    selectedTemplateId: defaultJournal?.templateId ?? null,
    selectedTemplateName: defaultJournal?.templateName ?? '게시 템플릿 없음',
    selectedTemplateVersionLabel:
      defaultJournal?.templateVersionLabel ?? '게시 버전 없음',
    documentStatus: defaultJournal?.status ?? 'draft',
    updatedAt: defaultJournal?.updatedAt ?? null,
    submittedAt: defaultJournal?.submittedAt ?? null,
    documentData:
      defaultJournal?.documentData ?? cloneInitialDocumentFormData(),
    hydrateJournal: (journal) => {
      set({
        journalId: journal.id,
        selectedTemplateId: journal.templateId,
        selectedTemplateName: journal.templateName,
        selectedTemplateVersionLabel: journal.templateVersionLabel,
        documentStatus: journal.status,
        updatedAt: journal.updatedAt,
        submittedAt: journal.submittedAt,
        documentData: cloneDocumentFormData(journal.documentData),
      });
    },
    updateDocumentField: (field, value) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          [field]: value,
        },
      }));
    },
    updateRichTextField: (field, value) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          [field]: value,
        },
      }));
    },
    updateMonitoringRow: (rowId, field, value) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          monitoringRows: state.documentData.monitoringRows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  [field]: value,
                }
              : row,
          ),
        },
      }));
    },
    addMonitoringRow: () => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          monitoringRows: [
            ...state.documentData.monitoringRows,
            {
              id: `monitoring-row-${monitoringRowSequence++}`,
              workDate: '',
              heatingStartTime: '',
              heatingTemperature: '',
              heatingEndTime: '',
              postHeatingSurfaceTemperature: '',
              suitability: null,
            },
          ],
        },
      }));
    },
    removeMonitoringRow: (rowId) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          monitoringRows: state.documentData.monitoringRows.filter(
            (row) => row.id !== rowId,
          ),
        },
      }));
    },
    updateCorrectiveRow: (rowId, field, value) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          correctiveRows: state.documentData.correctiveRows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  [field]: value,
                }
              : row,
          ),
        },
      }));
    },
    addCorrectiveRow: () => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          correctiveRows: [
            ...state.documentData.correctiveRows,
            {
              id: `corrective-row-${correctiveRowSequence++}`,
              deviationDetail: '',
              actionResult: '',
              actionTaken: false,
              reportedToManager: false,
            },
          ],
        },
      }));
    },
    removeCorrectiveRow: (rowId) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          correctiveRows: state.documentData.correctiveRows.filter(
            (row) => row.id !== rowId,
          ),
        },
      }));
    },
    resetDocument: () => {
      set({
        journalId: defaultJournal?.id ?? null,
        selectedTemplateId: defaultJournal?.templateId ?? null,
        selectedTemplateName:
          defaultJournal?.templateName ?? '게시 템플릿 없음',
        selectedTemplateVersionLabel:
          defaultJournal?.templateVersionLabel ?? '게시 버전 없음',
        documentStatus: defaultJournal?.status ?? 'draft',
        updatedAt: defaultJournal?.updatedAt ?? null,
        submittedAt: defaultJournal?.submittedAt ?? null,
        documentData:
          defaultJournal?.documentData ?? cloneInitialDocumentFormData(),
      });
    },
    markDraftSaved: (updatedAt) => {
      set({
        documentStatus: 'draft',
        updatedAt,
        submittedAt: null,
      });
    },
    markSubmitted: (submittedAt) => {
      set({
        documentStatus: 'submitted',
        updatedAt: submittedAt,
        submittedAt,
      });
    },
  }),
);
