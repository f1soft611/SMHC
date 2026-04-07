import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  documentTemplateQueryKeys,
  getJournalRecord,
  saveJournalDraft,
  submitJournal,
} from '../api/documentTemplateApi';
import type { DemoSaveJournalPayload } from '../types/documentTemplateDemo';

export function useDocumentJournalQuery(templateId: string | null) {
  return useQuery({
    queryKey: templateId
      ? documentTemplateQueryKeys.journal(templateId)
      : [...documentTemplateQueryKeys.all, 'journal', 'idle'],
    queryFn: () => getJournalRecord(templateId ?? ''),
    enabled: templateId !== null,
  });
}

export function useDocumentJournalMutations(templateId: string | null) {
  const queryClient = useQueryClient();

  const invalidateJournal = async () => {
    if (!templateId) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: documentTemplateQueryKeys.journal(templateId),
    });
  };

  return {
    saveDraftMutation: useMutation({
      mutationFn: (payload: DemoSaveJournalPayload) =>
        saveJournalDraft(payload),
      onSuccess: invalidateJournal,
    }),
    submitJournalMutation: useMutation({
      mutationFn: (payload: DemoSaveJournalPayload) => submitJournal(payload),
      onSuccess: invalidateJournal,
    }),
  };
}
