import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import PreviewRounded from '@mui/icons-material/PreviewRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import TaskRounded from '@mui/icons-material/TaskRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import { StructuredCcpTemplateCanvas } from '../features/document-template-demo/components/StructuredCcpTemplateCanvas';
import { TemplateOutlinePanel } from '../features/document-template-demo/components/TemplateOutlinePanel';
import {
  useDocumentJournalMutations,
  useDocumentJournalQuery,
} from '../features/document-template-demo/hooks/useDocumentJournalQueries';
import { usePublishedTemplateContextsQuery } from '../features/document-template-demo/hooks/useTemplateQueries';
import { useDocumentInstanceStore } from '../features/document-template-demo/store/useDocumentInstanceStore';
import { createDocumentPreviewHtml } from '../features/document-template-demo/types/documentTemplateDemo';

export function DocumentJournalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTemplateId = searchParams.get('templateId');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    requestedTemplateId,
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const { data: publishedTemplates = [] } = usePublishedTemplateContextsQuery();
  const activeTemplateId =
    selectedTemplateId ?? publishedTemplates[0]?.templateId ?? null;
  const { data: journalRecord } = useDocumentJournalQuery(activeTemplateId);
  const { saveDraftMutation, submitJournalMutation } =
    useDocumentJournalMutations(activeTemplateId);

  const activeTemplate = useMemo(
    () =>
      publishedTemplates.find(
        (template) => template.templateId === activeTemplateId,
      ) ??
      publishedTemplates[0] ??
      null,
    [activeTemplateId, publishedTemplates],
  );

  const resolvedSelectedBlockId = useMemo(() => {
    const firstBlockId = activeTemplate?.schema.sections[0]?.blocks[0]?.id;

    if (!firstBlockId) {
      return 'block-title';
    }

    if (!selectedBlockId) {
      return firstBlockId;
    }

    const blockExists = activeTemplate.schema.sections.some((section) =>
      section.blocks.some((block) => block.id === selectedBlockId),
    );

    return blockExists ? selectedBlockId : firstBlockId;
  }, [activeTemplate, selectedBlockId]);

  const hydrateJournal = useDocumentInstanceStore(
    (state) => state.hydrateJournal,
  );
  const selectedTemplateName = useDocumentInstanceStore(
    (state) => state.selectedTemplateName,
  );
  const selectedTemplateVersionLabel = useDocumentInstanceStore(
    (state) => state.selectedTemplateVersionLabel,
  );
  const documentStatus = useDocumentInstanceStore(
    (state) => state.documentStatus,
  );
  const updatedAt = useDocumentInstanceStore((state) => state.updatedAt);
  const submittedAt = useDocumentInstanceStore((state) => state.submittedAt);
  const documentData = useDocumentInstanceStore((state) => state.documentData);
  const updateDocumentField = useDocumentInstanceStore(
    (state) => state.updateDocumentField,
  );
  const updateRichTextField = useDocumentInstanceStore(
    (state) => state.updateRichTextField,
  );
  const updateMonitoringRow = useDocumentInstanceStore(
    (state) => state.updateMonitoringRow,
  );
  const addMonitoringRow = useDocumentInstanceStore(
    (state) => state.addMonitoringRow,
  );
  const removeMonitoringRow = useDocumentInstanceStore(
    (state) => state.removeMonitoringRow,
  );
  const updateCorrectiveRow = useDocumentInstanceStore(
    (state) => state.updateCorrectiveRow,
  );
  const addCorrectiveRow = useDocumentInstanceStore(
    (state) => state.addCorrectiveRow,
  );
  const removeCorrectiveRow = useDocumentInstanceStore(
    (state) => state.removeCorrectiveRow,
  );
  const resetDocument = useDocumentInstanceStore(
    (state) => state.resetDocument,
  );

  useEffect(() => {
    if (!journalRecord) {
      return;
    }

    hydrateJournal(journalRecord);
  }, [hydrateJournal, journalRecord]);

  const templateSummary = useMemo(
    () =>
      activeTemplate
        ? `${activeTemplate.schema.sections.length}개 섹션 / ${activeTemplate.schema.sections.reduce((count, section) => count + section.blocks.length, 0)}개 블록`
        : '게시된 템플릿 없음',
    [activeTemplate],
  );

  const journalMode =
    documentStatus === 'submitted' ? 'journal-readonly' : 'journal-draft';

  const handlePreview = () => {
    setPreviewHtml(createDocumentPreviewHtml(documentData));
  };

  const buildPayload = () => {
    if (!activeTemplate) {
      return null;
    }

    return {
      templateId: activeTemplate.templateId,
      templateVersionId: activeTemplate.templateVersionId,
      documentData,
    };
  };

  const handleSaveDraft = async () => {
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    const savedJournal = await saveDraftMutation.mutateAsync(payload);

    hydrateJournal(savedJournal);
  };

  const handleSubmit = async () => {
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    const submittedJournal = await submitJournalMutation.mutateAsync(payload);

    hydrateJournal(submittedJournal);
    setPreviewHtml(createDocumentPreviewHtml(submittedJournal.documentData));
  };

  const handleReset = () => {
    if (journalRecord) {
      hydrateJournal(journalRecord);
    } else {
      resetDocument();
    }

    setPreviewHtml('');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      <TopNavigation />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <TaskRounded color="primary" />
                    <Typography variant="h4" fontWeight={800}>
                      CCP 점검일지 작성
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ maxWidth: 900 }}>
                    게시된 템플릿을 그대로 조회하면서 점검값만 입력하는
                    화면입니다. 초안 저장은 가능하지만 제출 후에는 조회 전용으로
                    전환되어 템플릿과 입력값 모두 수정할 수 없습니다.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/haccp-docs/templates')}
                  >
                    템플릿 목록
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveRounded />}
                    onClick={handleSaveDraft}
                    disabled={
                      saveDraftMutation.isPending ||
                      documentStatus === 'submitted' ||
                      activeTemplate === null
                    }
                  >
                    초안 저장
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<LockRounded />}
                    onClick={handleSubmit}
                    disabled={
                      submitJournalMutation.isPending ||
                      documentStatus === 'submitted' ||
                      activeTemplate === null
                    }
                  >
                    제출 후 잠금
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PreviewRounded />}
                    onClick={handlePreview}
                  >
                    미리보기 생성
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AutorenewRounded />}
                    onClick={handleReset}
                  >
                    작성값 초기화
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={selectedTemplateName} color="primary" />
                <Chip label={selectedTemplateVersionLabel} variant="outlined" />
                <Chip label={templateSummary} variant="outlined" />
                <Chip
                  label={
                    documentStatus === 'submitted'
                      ? '제출 완료'
                      : '초안 작성 중'
                  }
                  color={documentStatus === 'submitted' ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Stack>

              <Alert
                severity={documentStatus === 'submitted' ? 'success' : 'info'}
              >
                {documentStatus === 'submitted'
                  ? '제출된 점검일지는 조회 전용입니다. 재편집 대신 새로운 초안을 생성하거나 다음 템플릿 버전을 사용해야 합니다.'
                  : '게시된 템플릿 필드는 고정되어 있으며, 점검자가 입력해야 하는 값만 수정할 수 있습니다.'}
              </Alert>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack spacing={2}>
                <Paper sx={{ borderRadius: 3, p: 2.5 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      게시 템플릿 선택
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      점검일지 작성은 게시된 버전만 사용할 수 있습니다.
                    </Typography>
                    <Stack spacing={1}>
                      {publishedTemplates.map((template) => (
                        <Paper
                          key={template.templateId}
                          variant="outlined"
                          onClick={() => {
                            setSelectedTemplateId(template.templateId);
                            setSelectedBlockId(null);
                            setPreviewHtml('');
                          }}
                          sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            borderColor:
                              activeTemplateId === template.templateId
                                ? 'primary.main'
                                : 'divider',
                            bgcolor:
                              activeTemplateId === template.templateId
                                ? 'primary.50'
                                : 'background.paper',
                          }}
                        >
                          <Typography variant="body2" fontWeight={700}>
                            {template.templateName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.templateVersionLabel}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>

                {activeTemplate ? (
                  <TemplateOutlinePanel
                    schema={activeTemplate.schema}
                    selectedBlockId={resolvedSelectedBlockId}
                    onSelectBlock={setSelectedBlockId}
                  />
                ) : null}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack spacing={2}>
                <StructuredCcpTemplateCanvas
                  data={documentData}
                  mode={journalMode}
                  onChangeField={updateDocumentField}
                  onChangeMonitoringRow={updateMonitoringRow}
                  onAddMonitoringRow={addMonitoringRow}
                  onRemoveMonitoringRow={removeMonitoringRow}
                  onChangeCorrectiveRow={updateCorrectiveRow}
                  onChangeRichTextField={updateRichTextField}
                  onAddCorrectiveRow={addCorrectiveRow}
                  onRemoveCorrectiveRow={removeCorrectiveRow}
                />

                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    sx={{ px: 2.5, pt: 2.5, gap: 2 }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionRounded
                          color="secondary"
                          fontSize="small"
                        />
                        <Typography variant="subtitle1" fontWeight={700}>
                          점검일지 조회 미리보기
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        저장 여부와 관계없이 현재 입력 기준 HTML 조회 화면을
                        확인할 수 있습니다. 제출 이후에는 이 미리보기와 동일한
                        읽기 전용 상태로 유지됩니다.
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ p: 2.5 }}>
                    {previewHtml ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, minHeight: 260, bgcolor: 'grey.50' }}
                      >
                        <Box
                          sx={{
                            fontFamily: 'Pretendard, sans-serif',
                            '& table': {
                              width: '100%',
                              borderCollapse: 'collapse',
                              my: 1,
                            },
                            '& th, & td': {
                              border: '1px solid',
                              borderColor: 'divider',
                              p: 1,
                            },
                            '& p': {
                              my: 0.5,
                            },
                          }}
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      </Paper>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          minHeight: 260,
                          bgcolor: 'grey.50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 3,
                        }}
                      >
                        <Stack spacing={1} alignItems="center">
                          <PreviewRounded color="disabled" />
                          <Typography variant="body1" fontWeight={600}>
                            아직 생성된 점검일지 미리보기가 없습니다.
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            상단의 미리보기 생성 버튼으로 현재 작성 내용을
                            확인하세요.
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack spacing={2}>
                <Paper sx={{ borderRadius: 3, p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    점검 상태
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {documentStatus === 'submitted'
                      ? `최종 제출 시각: ${submittedAt ?? '-'}`
                      : `최근 초안 저장 시각: ${updatedAt ?? '-'}`}
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    <Chip
                      label={
                        documentStatus === 'submitted'
                          ? '조회 전용'
                          : '입력 가능'
                      }
                      color={
                        documentStatus === 'submitted' ? 'success' : 'warning'
                      }
                      variant="outlined"
                    />
                    {activeTemplate ? (
                      <Chip
                        label={activeTemplate.templateVersionLabel}
                        variant="outlined"
                      />
                    ) : null}
                  </Stack>
                </Paper>

                <Paper sx={{ borderRadius: 3, p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    작성 규칙
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      1. 제목, 기준값, 방법 문구는 게시 템플릿에서만 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2. 점검 데이터 입력은 초안 상태에서만 수정 가능
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3. 제출 후에는 행 추가/삭제와 체크 변경까지 모두 잠금
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
