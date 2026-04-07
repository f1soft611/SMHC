import { create } from 'zustand';
import {
  cloneTemplateDetail,
  getCurrentTemplateVersion,
  initialTemplateLibrary,
  type DemoTemplateDetail,
} from '../types/documentTemplateDemo';

interface TemplateManagementState {
  workingTemplate: DemoTemplateDetail | null;
  selectedTemplateId: string | null;
  selectedVersionId: string | null;
  hydrateTemplate: (template: DemoTemplateDetail) => void;
  selectVersion: (versionId: string) => void;
  updateTemplateMetadata: (updates: {
    name?: string;
    summary?: string;
    description?: string;
    category?: string;
  }) => void;
  updateEditorContent: (editorContent: string) => void;
  resetTemplate: () => void;
}
const initialTemplate = cloneTemplateDetail(initialTemplateLibrary[0]);

export const useTemplateManagementStore = create<TemplateManagementState>(
  (set) => ({
    workingTemplate: initialTemplate,
    selectedTemplateId: initialTemplate.id,
    selectedVersionId: initialTemplate.currentVersionId,
    hydrateTemplate: (template) => {
      const cloned = cloneTemplateDetail(template);

      set({
        workingTemplate: cloned,
        selectedTemplateId: cloned.id,
        selectedVersionId: cloned.currentVersionId,
      });
    },
    selectVersion: (versionId) => {
      set((state) => {
        if (!state.workingTemplate) {
          return state;
        }

        const version =
          state.workingTemplate.versions.find(
            (item) => item.id === versionId,
          ) ?? getCurrentTemplateVersion(state.workingTemplate);

        return {
          selectedVersionId: version.id,
        };
      });
    },
    updateTemplateMetadata: (updates) => {
      set((state) => ({
        workingTemplate:
          state.workingTemplate === null
            ? null
            : {
                ...state.workingTemplate,
                ...updates,
              },
      }));
    },
    updateEditorContent: (editorContent) => {
      set((state) => ({
        workingTemplate:
          state.workingTemplate === null
            ? null
            : {
                ...state.workingTemplate,
                versions: state.workingTemplate.versions.map((version) =>
                  version.id === state.selectedVersionId
                    ? {
                        ...version,
                        editorContent,
                      }
                    : version,
                ),
              },
      }));
    },
    resetTemplate: () => {
      set({
        workingTemplate: cloneTemplateDetail(initialTemplateLibrary[0]),
        selectedTemplateId: initialTemplateLibrary[0].id,
        selectedVersionId: initialTemplateLibrary[0].currentVersionId,
      });
    },
  }),
);
