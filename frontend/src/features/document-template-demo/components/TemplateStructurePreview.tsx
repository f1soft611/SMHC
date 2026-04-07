import AutoFixHighRounded from '@mui/icons-material/AutoFixHighRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import RuleRounded from '@mui/icons-material/RuleRounded';
import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import type { DemoTemplateSchema } from '../types/documentTemplateDemo';

interface TemplateStructurePreviewProps {
  schema: DemoTemplateSchema;
  selectedBlockId: string;
}

export function TemplateStructurePreview({
  schema,
  selectedBlockId,
}: TemplateStructurePreviewProps) {
  const totalBlocks = schema.sections.reduce(
    (count, section) => count + section.blocks.length,
    0,
  );

  return (
    <Paper sx={{ borderRadius: 3, p: 2.5 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <AutoFixHighRounded color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>
                템플릿 구조 미리보기
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              좌측에서 선택한 블록과 우측 속성 수정 결과를 템플릿 구조 기준으로
              확인합니다.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`섹션 ${schema.sections.length}개`}
              color="primary"
              size="small"
            />
            <Chip
              label={`블록 ${totalBlocks}개`}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          {schema.sections.map((section, index) => (
            <Paper key={section.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    TEMPLATE SECTION {index + 1}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  {section.blocks.map((block) => {
                    const isSelected = block.id === selectedBlockId;

                    return (
                      <Box
                        key={block.id}
                        sx={{
                          border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected
                            ? 'primary.50'
                            : 'background.paper',
                          borderRadius: 2,
                          px: 1.5,
                          py: 1.25,
                        }}
                      >
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                          >
                            <DescriptionRounded
                              fontSize="small"
                              color={isSelected ? 'primary' : 'action'}
                              sx={{ mt: 0.25 }}
                            />
                            <Box>
                              <Typography variant="body1" fontWeight={700}>
                                {block.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {block.description}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Chip
                              size="small"
                              label={block.type}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              icon={<RuleRounded />}
                              label={block.required ? '필수' : '선택'}
                              color={block.required ? 'warning' : 'default'}
                              variant={block.required ? 'filled' : 'outlined'}
                            />
                          </Stack>
                        </Stack>

                        {block.placeholder ? (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            placeholder: {block.placeholder}
                          </Typography>
                        ) : null}
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
