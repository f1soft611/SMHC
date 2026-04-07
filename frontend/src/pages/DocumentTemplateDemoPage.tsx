import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import PreviewRounded from '@mui/icons-material/PreviewRounded';
import SmartToyRounded from '@mui/icons-material/SmartToyRounded';
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
import { useMemo, useState } from 'react';
import { TopNavigation } from '../features/navigation/components/TopNavigation';
import { StructuredCcpTemplateCanvas } from '../features/document-template-demo/components/StructuredCcpTemplateCanvas';
import { TemplateOutlinePanel } from '../features/document-template-demo/components/TemplateOutlinePanel';
import { TemplatePropertyPanel } from '../features/document-template-demo/components/TemplatePropertyPanel';
import { useDocumentTemplateDemoStore } from '../features/document-template-demo/store/useDocumentTemplateDemoStore';
import {
  createDocumentPreviewHtml,
  findTemplateBlockById,
} from '../features/document-template-demo/types/documentTemplateDemo';

export function DocumentTemplateDemoPage() {
  const templateSchema = useDocumentTemplateDemoStore(
    (state) => state.templateSchema,
  );
  const documentData = useDocumentTemplateDemoStore(
    (state) => state.documentData,
  );
  const selectedBlockId = useDocumentTemplateDemoStore(
    (state) => state.selectedBlockId,
  );
  const selectBlock = useDocumentTemplateDemoStore(
    (state) => state.selectBlock,
  );
  const updateSelectedBlock = useDocumentTemplateDemoStore(
    (state) => state.updateSelectedBlock,
  );
  const updateDocumentField = useDocumentTemplateDemoStore(
    (state) => state.updateDocumentField,
  );
  const updateRichTextField = useDocumentTemplateDemoStore(
    (state) => state.updateRichTextField,
  );
  const updateMonitoringRow = useDocumentTemplateDemoStore(
    (state) => state.updateMonitoringRow,
  );
  const addMonitoringRow = useDocumentTemplateDemoStore(
    (state) => state.addMonitoringRow,
  );
  const removeMonitoringRow = useDocumentTemplateDemoStore(
    (state) => state.removeMonitoringRow,
  );
  const updateCorrectiveRow = useDocumentTemplateDemoStore(
    (state) => state.updateCorrectiveRow,
  );
  const addCorrectiveRow = useDocumentTemplateDemoStore(
    (state) => state.addCorrectiveRow,
  );
  const removeCorrectiveRow = useDocumentTemplateDemoStore(
    (state) => state.removeCorrectiveRow,
  );
  const resetDemo = useDocumentTemplateDemoStore((state) => state.resetDemo);
  const [previewHtml, setPreviewHtml] = useState('');

  const selectedBlock = useMemo(
    () => findTemplateBlockById(templateSchema, selectedBlockId),
    [selectedBlockId, templateSchema],
  );

  const schemaJson = useMemo(
    () => JSON.stringify(templateSchema, null, 2),
    [templateSchema],
  );

  const handlePreview = () => {
    setPreviewHtml(createDocumentPreviewHtml(documentData));
  };

  const handleReset = () => {
    resetDemo();
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
                    <SmartToyRounded color="primary" />
                    <Typography variant="h4" fontWeight={800}>
                      CCP 문서 템플릿 데모
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ maxWidth: 840 }}>
                    실제 현업 양식에 가까운 고정 서식 문서 안에서 행 추가,
                    체크박스 선택, 메타 정보 입력, 서술형 문구 직접 입력을 함께
                    시연하는 화면입니다. 방법/개선조치 구간도 문서 안에서 바로
                    수정할 수 있도록 구성했습니다.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    variant="contained"
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
                    데모 초기화
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="frontend-1to4 데모 범위" color="primary" />
                <Chip label="실제 AI 호출 제외" variant="outlined" />
                <Chip label="고정 서식 CCP 양식형" variant="outlined" />
                <Chip label="행 추가/체크박스 시연" variant="outlined" />
                <Chip label="서술형 구간 직접 입력" variant="outlined" />
                <Chip label="버튼 기반 미리보기" variant="outlined" />
              </Stack>

              <Alert severity="info">
                후속 단계에서는 예시 문서 업로드와 AI 초안 생성 API를 연결하고,
                현재 중앙 양식의 구조 데이터를 실제 템플릿 스키마 및 저장 API와
                연결할 예정입니다.
              </Alert>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 3 }}>
              <TemplateOutlinePanel
                schema={templateSchema}
                selectedBlockId={selectedBlockId}
                onSelectBlock={selectBlock}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack spacing={2}>
                <StructuredCcpTemplateCanvas
                  data={documentData}
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
                      <Typography variant="subtitle1" fontWeight={700}>
                        문서 미리보기
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        입력 중에는 변환하지 않고, 미리보기 생성 버튼을 눌렀을
                        때만 현재 문서를 HTML 미리보기로 렌더링합니다.
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
                            '& ul': {
                              pl: 3,
                            },
                          }}
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          미리보기는 마지막으로 생성한 시점의 문서 상태를
                          보여줍니다. 입력값을 수정한 뒤에는 다시 미리보기를
                          생성해야 반영됩니다.
                        </Typography>
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
                            아직 생성된 미리보기가 없습니다.
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            상단의 미리보기 생성 버튼을 눌러 현재 문서를
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
              <TemplatePropertyPanel
                selectedBlock={selectedBlock}
                schemaJson={schemaJson}
                onChange={updateSelectedBlock}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
