import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import EditNoteRounded from '@mui/icons-material/EditNoteRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import PublishRounded from '@mui/icons-material/PublishRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import { DocumentTemplateEditor } from '../features/document-template-demo/components/DocumentTemplateEditor';
import { useTemplateManagementStore } from '../features/document-template-demo/store/useTemplateManagementStore';
import {
  findTemplateVersionById,
  getCurrentTemplateVersion,
} from '../features/document-template-demo/types/documentTemplateDemo';
import {
  useTemplateDetailQuery,
  useTemplateMutations,
} from '../features/document-template-demo/hooks/useTemplateQueries';

export function DocumentTemplateEditorPage() {
  const navigate = useNavigate();
  const { templateId = '' } = useParams();
  const [isMetaDialogOpen, setIsMetaDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const {
    data: templateDetail,
    isLoading,
    isError,
  } = useTemplateDetailQuery(templateId || null);
  const {
    createVersionMutation,
    publishVersionMutation,
    saveTemplateMutation,
  } = useTemplateMutations();

  const workingTemplate = useTemplateManagementStore(
    (state) => state.workingTemplate,
  );
  const hydrateTemplate = useTemplateManagementStore(
    (state) => state.hydrateTemplate,
  );
  const selectedVersionId = useTemplateManagementStore(
    (state) => state.selectedVersionId,
  );
  const selectVersion = useTemplateManagementStore(
    (state) => state.selectVersion,
  );
  const updateTemplateMetadata = useTemplateManagementStore(
    (state) => state.updateTemplateMetadata,
  );
  const updateEditorContent = useTemplateManagementStore(
    (state) => state.updateEditorContent,
  );
  const resetTemplate = useTemplateManagementStore(
    (state) => state.resetTemplate,
  );

  useEffect(() => {
    if (!templateDetail) {
      return;
    }

    hydrateTemplate(templateDetail);
  }, [hydrateTemplate, templateDetail]);

  const selectedVersion = useMemo(() => {
    if (!workingTemplate) {
      return null;
    }

    return (
      findTemplateVersionById(
        workingTemplate,
        selectedVersionId ?? workingTemplate.currentVersionId,
      ) ?? getCurrentTemplateVersion(workingTemplate)
    );
  }, [selectedVersionId, workingTemplate]);

  const selectedVersionSummary = useMemo(() => {
    if (!selectedVersion) {
      return '버전 정보 없음';
    }

    return selectedVersion.publishedAt
      ? `${selectedVersion.label} · 게시 ${selectedVersion.publishedAt.slice(0, 10)}`
      : `${selectedVersion.label} · 초안 편집 중`;
  }, [selectedVersion]);

  const currentStageIndex = useMemo(() => {
    if (!selectedVersion) {
      return 0;
    }

    if (selectedVersion.status === 'published') {
      return 3;
    }

    if (selectedVersion.status === 'archived') {
      return 2;
    }

    return 1;
  }, [selectedVersion]);

  const operationStages = useMemo(
    () => ['기본정보 확인', '초안 편집', '버전 검토 준비', '게시 반영'],
    [],
  );

  const isActionMenuOpen = Boolean(actionMenuAnchor);

  const handleSaveTemplate = async () => {
    if (!workingTemplate) {
      return;
    }

    const savedTemplate =
      await saveTemplateMutation.mutateAsync(workingTemplate);
    hydrateTemplate(savedTemplate);
  };

  const handleCreateVersion = async () => {
    if (!workingTemplate) {
      return;
    }

    const savedTemplate = await createVersionMutation.mutateAsync(
      workingTemplate.id,
    );
    hydrateTemplate(savedTemplate);
    setActionMenuAnchor(null);
  };

  const handlePublishVersion = async () => {
    if (!workingTemplate || !selectedVersion) {
      return;
    }

    const savedTemplate = await publishVersionMutation.mutateAsync({
      templateId: workingTemplate.id,
      versionId: selectedVersion.id,
    });
    hydrateTemplate(savedTemplate);
  };

  const handleResetTemplate = () => {
    resetTemplate();

    if (templateDetail) {
      hydrateTemplate(templateDetail);
    }

    setActionMenuAnchor(null);
  };

  const handleBack = () => {
    navigate('/haccp-docs/templates');
  };

  const handleOpenMetaDialog = () => {
    setIsMetaDialogOpen(true);
    setActionMenuAnchor(null);
  };

  const handleOpenActionMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      <TopNavigation />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SchemaRounded color="primary" />
                    <Typography
                      variant="overline"
                      color="primary.main"
                      fontWeight={800}
                      letterSpacing={0.6}
                    >
                      CCP 템플릿 운영 편집
                    </Typography>
                  </Stack>

                  <Box>
                    <Typography variant="h4" fontWeight={800}>
                      {workingTemplate?.name ?? 'CCP 문서 템플릿 편집'}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ maxWidth: 920, mt: 1 }}
                    >
                      운영 단계 기준으로 초안 편집과 게시 반영 흐름을 한
                      화면에서 정리했습니다. 표 작업은 메뉴와 컬러 선택기로
                      빠르게 처리할 수 있습니다.
                    </Typography>
                  </Box>

                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.25}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {operationStages.map((stage, index) => {
                      const isActive = index === currentStageIndex;
                      const isCompleted = index < currentStageIndex;

                      return (
                        <Paper
                          key={stage}
                          variant="outlined"
                          sx={{
                            px: 1.5,
                            py: 1,
                            minWidth: 132,
                            borderRadius: 2.5,
                            borderColor: isActive
                              ? 'primary.main'
                              : isCompleted
                                ? 'success.light'
                                : 'divider',
                            bgcolor: isActive
                              ? 'primary.50'
                              : isCompleted
                                ? 'success.50'
                                : 'background.paper',
                          }}
                        >
                          <Typography
                            variant="caption"
                            color={
                              isActive
                                ? 'primary.main'
                                : isCompleted
                                  ? 'success.main'
                                  : 'text.secondary'
                            }
                            fontWeight={700}
                          >
                            STEP {index + 1}
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {stage}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Stack>

                <Stack
                  spacing={1.5}
                  sx={{ width: { xs: '100%', lg: 'auto' }, minWidth: 0 }}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 240 } }}
                  >
                    <InputLabel id="template-version-select-label">
                      작업 버전
                    </InputLabel>
                    <Select
                      labelId="template-version-select-label"
                      label="작업 버전"
                      value={selectedVersion?.id ?? ''}
                      onChange={(event) => selectVersion(event.target.value)}
                      disabled={
                        !workingTemplate ||
                        workingTemplate.versions.length === 0
                      }
                    >
                      {(workingTemplate?.versions ?? []).map((version) => (
                        <MenuItem key={version.id} value={version.id}>
                          {version.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackRounded />}
                      onClick={handleBack}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      목록
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveRounded />}
                      onClick={handleSaveTemplate}
                      disabled={
                        saveTemplateMutation.isPending || !workingTemplate
                      }
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      저장
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PublishRounded />}
                      onClick={handlePublishVersion}
                      disabled={
                        publishVersionMutation.isPending ||
                        !selectedVersion ||
                        selectedVersion.status === 'published'
                      }
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      게시 반영
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={handleOpenActionMenu}
                      aria-label="추가 작업"
                    >
                      <MoreVertRounded />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={selectedVersionSummary} color="primary" />
                <Chip
                  label={operationStages[currentStageIndex]}
                  color="secondary"
                  variant="outlined"
                />
                {selectedVersion ? (
                  <Chip label={selectedVersion.status} variant="outlined" />
                ) : null}
                {workingTemplate ? (
                  <Chip label={workingTemplate.category} variant="outlined" />
                ) : null}
              </Stack>

              <Alert severity="info">
                글자 정렬, 글자 크기, 글자색, 글씨 배경색, 셀 배경색을 엑셀처럼
                바로 조정할 수 있고 새 표는 흰 일반 셀로 시작합니다.
              </Alert>
            </Stack>
          </Paper>

          {isLoading ? (
            <Alert severity="info">템플릿을 불러오는 중입니다.</Alert>
          ) : null}

          {isError ? (
            <Alert severity="error">
              요청한 템플릿을 찾지 못했습니다. 목록 화면에서 다시 선택하세요.
            </Alert>
          ) : null}

          {workingTemplate && selectedVersion ? (
            <DocumentTemplateEditor
              title="문서 본문 편집"
              content={selectedVersion.editorContent}
              onChange={updateEditorContent}
              minHeight={700}
              pageMode="a4"
            />
          ) : null}
        </Stack>
      </Container>

      <Menu
        anchorEl={actionMenuAnchor}
        open={isActionMenuOpen}
        onClose={handleCloseActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenMetaDialog} disabled={!workingTemplate}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EditNoteRounded fontSize="small" />
            <Typography variant="body2">기본정보 수정</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleCreateVersion}
          disabled={createVersionMutation.isPending || !workingTemplate}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ContentCopyRounded fontSize="small" />
            <Typography variant="body2">버전 복제</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleResetTemplate}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutorenewRounded fontSize="small" />
            <Typography variant="body2">변경 취소</Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Dialog
        open={isMetaDialogOpen}
        onClose={() => setIsMetaDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>템플릿 기본정보</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="템플릿명"
              size="small"
              fullWidth
              value={workingTemplate?.name ?? ''}
              onChange={(event) =>
                updateTemplateMetadata({ name: event.target.value })
              }
            />
            <TextField
              label="카테고리"
              size="small"
              fullWidth
              value={workingTemplate?.category ?? ''}
              onChange={(event) =>
                updateTemplateMetadata({ category: event.target.value })
              }
            />
            <TextField
              label="요약"
              size="small"
              fullWidth
              value={workingTemplate?.summary ?? ''}
              onChange={(event) =>
                updateTemplateMetadata({ summary: event.target.value })
              }
            />
            <TextField
              label="설명"
              size="small"
              multiline
              minRows={4}
              fullWidth
              value={workingTemplate?.description ?? ''}
              onChange={(event) =>
                updateTemplateMetadata({ description: event.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMetaDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
