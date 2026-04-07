import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import HistoryRounded from '@mui/icons-material/HistoryRounded';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import NoteAltRounded from '@mui/icons-material/NoteAltRounded';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import {
  useTemplateDetailQuery,
  useTemplateLibraryQuery,
  useTemplateMutations,
} from '../features/document-template-demo/hooks/useTemplateQueries';

export function DocumentTemplateManagementPage() {
  const navigate = useNavigate();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const { data: templateSummaries = [] } = useTemplateLibraryQuery();
  const activeTemplateId =
    selectedTemplateId ?? templateSummaries[0]?.id ?? null;
  const { data: templateDetail } = useTemplateDetailQuery(activeTemplateId);
  const { createTemplateMutation } = useTemplateMutations();

  const handleCreateTemplate = async () => {
    const createdTemplate = await createTemplateMutation.mutateAsync();

    navigate(`/haccp-docs/templates/${createdTemplate.id}/editor`);
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
                    <SchemaRounded color="primary" />
                    <Typography variant="h4" fontWeight={800}>
                      CCP 문서 템플릿 목록
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ maxWidth: 900 }}>
                    초기 진입 화면을 템플릿 라이브러리 중심으로 다시
                    구성했습니다. 여기서 현재 템플릿 상태와 버전 이력을
                    확인하고, 생성 버튼으로 전용 편집 화면으로 이동합니다.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleRounded />}
                    onClick={handleCreateTemplate}
                    disabled={createTemplateMutation.isPending}
                  >
                    템플릿 생성
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="목록 진입형 구조" color="primary" />
                <Chip label="Data Grid 조회" variant="outlined" />
                <Chip label="버전/이력 사이드 패널" variant="outlined" />
                <Chip label="편집 화면 분리" variant="outlined" />
              </Stack>

              <Alert severity="info">
                편집은 전용 화면으로 이동하고, 목록에서는 템플릿 선택, 상태
                확인, 버전 이력 파악, 점검일지 진입만 빠르게 처리합니다.
              </Alert>
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3}>
            <Paper sx={{ flex: 1, borderRadius: 3, p: 2 }}>
              <Table size="small" sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>템플릿명</TableCell>
                    <TableCell>카테고리</TableCell>
                    <TableCell>현재 버전</TableCell>
                    <TableCell>게시 버전</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>최종 수정일</TableCell>
                    <TableCell align="right">액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templateSummaries.map((templateSummary) => {
                    const isSelected = templateSummary.id === activeTemplateId;

                    return (
                      <TableRow
                        key={templateSummary.id}
                        hover
                        selected={isSelected}
                        onClick={() =>
                          setSelectedTemplateId(templateSummary.id)
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>
                            {templateSummary.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {templateSummary.summary}
                          </Typography>
                        </TableCell>
                        <TableCell>{templateSummary.category}</TableCell>
                        <TableCell>
                          {templateSummary.currentVersionLabel}
                        </TableCell>
                        <TableCell>
                          {templateSummary.publishedVersionLabel ?? '게시 전'}
                        </TableCell>
                        <TableCell>{templateSummary.libraryStatus}</TableCell>
                        <TableCell>
                          {templateSummary.lastEditedAt.slice(0, 10)}
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Button
                              size="small"
                              variant="contained"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(
                                  `/haccp-docs/templates/${templateSummary.id}/editor`,
                                );
                              }}
                            >
                              편집
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={
                                templateSummary.libraryStatus === 'draft-only'
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(
                                  `/haccp-docs/documents?templateId=${templateSummary.id}`,
                                );
                              }}
                            >
                              일지 작성
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>

            <Stack spacing={2} sx={{ width: { xs: '100%', xl: 360 } }}>
              <Paper sx={{ borderRadius: 3, p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HistoryRounded color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      버전 이력 요약
                    </Typography>
                  </Stack>

                  {templateDetail ? (
                    <>
                      <Typography variant="body1" fontWeight={700}>
                        {templateDetail.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {templateDetail.description}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip
                          label={templateDetail.currentVersionLabel}
                          color="primary"
                        />
                        <Chip
                          label={
                            templateDetail.publishedVersionLabel ?? '게시 전'
                          }
                          variant="outlined"
                        />
                      </Stack>
                      <Stack spacing={1}>
                        {templateDetail.versions.map((version) => (
                          <Paper
                            key={version.id}
                            variant="outlined"
                            sx={{ p: 1.5 }}
                          >
                            <Typography variant="body2" fontWeight={700}>
                              {version.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {version.summary}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                              sx={{ mt: 1 }}
                            >
                              <Chip
                                size="small"
                                label={version.status}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={version.createdAt.slice(0, 10)}
                                variant="outlined"
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      목록에서 템플릿을 선택하면 버전 이력과 게시 상태를 볼 수
                      있습니다.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Paper sx={{ borderRadius: 3, p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NoteAltRounded color="secondary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      빠른 이동
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    endIcon={<LaunchRounded />}
                    disabled={!activeTemplateId}
                    onClick={() => {
                      if (!activeTemplateId) {
                        return;
                      }

                      navigate(
                        `/haccp-docs/templates/${activeTemplateId}/editor`,
                      );
                    }}
                  >
                    선택 템플릿 편집
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={
                      templateDetail === undefined ||
                      templateDetail.libraryStatus === 'draft-only'
                    }
                    onClick={() => {
                      if (!activeTemplateId) {
                        return;
                      }

                      navigate(
                        `/haccp-docs/documents?templateId=${activeTemplateId}`,
                      );
                    }}
                  >
                    선택 템플릿으로 일지 작성
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
