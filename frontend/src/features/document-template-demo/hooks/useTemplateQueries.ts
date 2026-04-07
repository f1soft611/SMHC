import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTemplate,
  createTemplateVersion,
  documentTemplateQueryKeys,
  getTemplateDetail,
  listPublishedTemplateContexts,
  listTemplateSummaries,
  publishTemplateVersion,
  saveTemplate,
} from '../api/documentTemplateApi';
import type { DemoTemplateDetail } from '../types/documentTemplateDemo';

export function useTemplateLibraryQuery() {
  return useQuery({
    queryKey: documentTemplateQueryKeys.templates(),
    queryFn: listTemplateSummaries,
  });
}

export function useTemplateDetailQuery(templateId: string | null) {
  return useQuery({
    queryKey: templateId
      ? documentTemplateQueryKeys.template(templateId)
      : [...documentTemplateQueryKeys.templates(), 'idle'],
    queryFn: () => getTemplateDetail(templateId ?? ''),
    enabled: templateId !== null,
  });
}

export function usePublishedTemplateContextsQuery() {
  return useQuery({
    queryKey: documentTemplateQueryKeys.publishedTemplates(),
    queryFn: listPublishedTemplateContexts,
  });
}

export function useTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidateTemplates = async (templateId?: string) => {
    await queryClient.invalidateQueries({
      queryKey: documentTemplateQueryKeys.templates(),
    });
    await queryClient.invalidateQueries({
      queryKey: documentTemplateQueryKeys.publishedTemplates(),
    });

    if (templateId) {
      await queryClient.invalidateQueries({
        queryKey: documentTemplateQueryKeys.template(templateId),
      });
    }
  };

  return {
    createTemplateMutation: useMutation({
      mutationFn: createTemplate,
      onSuccess: async (template) => {
        await invalidateTemplates(template.id);
      },
    }),
    saveTemplateMutation: useMutation({
      mutationFn: (template: DemoTemplateDetail) => saveTemplate(template),
      onSuccess: async (template) => {
        await invalidateTemplates(template.id);
      },
    }),
    createVersionMutation: useMutation({
      mutationFn: (templateId: string) => createTemplateVersion(templateId),
      onSuccess: async (template) => {
        await invalidateTemplates(template.id);
      },
    }),
    publishVersionMutation: useMutation({
      mutationFn: ({
        templateId,
        versionId,
      }: {
        templateId: string;
        versionId: string;
      }) => publishTemplateVersion(templateId, versionId),
      onSuccess: async (template) => {
        await invalidateTemplates(template.id);
      },
    }),
  };
}
