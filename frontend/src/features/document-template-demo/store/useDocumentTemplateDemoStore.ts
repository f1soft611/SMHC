import { create } from 'zustand';
import {
  initialDocumentFormData,
  initialTemplateSchema,
  type CorrectiveActionRow,
  type DemoDocumentFormData,
  type DemoTemplateSchema,
  type MonitoringRow,
  type SuitabilityValue,
} from '../types/documentTemplateDemo';

interface SavedSnapshot {
  html: string;
  capturedAt: string;
}

interface DocumentTemplateDemoState {
  templateSchema: DemoTemplateSchema;
  documentData: DemoDocumentFormData;
  selectedBlockId: string;
  savedSnapshot: SavedSnapshot | null;
  selectBlock: (blockId: string) => void;
  updateSelectedBlock: (updates: {
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
  }) => void;
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
  saveSnapshot: (html: string) => void;
  resetDemo: () => void;
}

const defaultSelectedBlockId = 'block-title';

function cloneInitialTemplateSchema(): DemoTemplateSchema {
  return structuredClone(initialTemplateSchema);
}

function cloneInitialDocumentFormData(): DemoDocumentFormData {
  return structuredClone(initialDocumentFormData);
}

let monitoringRowSequence = initialDocumentFormData.monitoringRows.length + 1;
let correctiveRowSequence = initialDocumentFormData.correctiveRows.length + 1;

export const useDocumentTemplateDemoStore = create<DocumentTemplateDemoState>(
  (set) => ({
    templateSchema: cloneInitialTemplateSchema(),
    documentData: cloneInitialDocumentFormData(),
    selectedBlockId: defaultSelectedBlockId,
    savedSnapshot: null,
    selectBlock: (blockId) => {
      set({ selectedBlockId: blockId });
    },
    updateSelectedBlock: (updates) => {
      set((state) => ({
        templateSchema: {
          ...state.templateSchema,
          sections: state.templateSchema.sections.map((section) => ({
            ...section,
            blocks: section.blocks.map((block) =>
              block.id === state.selectedBlockId
                ? {
                    ...block,
                    ...updates,
                  }
                : block,
            ),
          })),
        },
      }));
    },
    updateDocumentField: (field, value) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          [field]: value,
        },
      }));
    },
    updateRichTextField: (field, html) => {
      set((state) => ({
        documentData: {
          ...state.documentData,
          [field]: html,
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
    saveSnapshot: (html) => {
      set({
        savedSnapshot: {
          html,
          capturedAt: new Date().toISOString(),
        },
      });
    },
    resetDemo: () => {
      set({
        templateSchema: cloneInitialTemplateSchema(),
        documentData: cloneInitialDocumentFormData(),
        selectedBlockId: defaultSelectedBlockId,
        savedSnapshot: null,
      });
    },
  }),
);
