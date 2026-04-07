import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import ViewAgendaRounded from '@mui/icons-material/ViewAgendaRounded';
import {
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { DemoTemplateSchema } from '../types/documentTemplateDemo';

interface TemplateOutlinePanelProps {
  schema: DemoTemplateSchema;
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
}

export function TemplateOutlinePanel({
  schema,
  selectedBlockId,
  onSelectBlock,
}: TemplateOutlinePanelProps) {
  return (
    <Paper sx={{ borderRadius: 3, p: 2.5, height: '100%' }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ViewAgendaRounded color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={700}>
            템플릿 구조
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          AI가 제안한 템플릿 블록을 검토하고, 수정할 블록을 선택합니다.
        </Typography>

        <Chip
          icon={<AutoAwesomeRounded />}
          label="실제 AI 호출은 후속 단계에서 연결"
          color="primary"
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
        />

        {schema.sections.map((section, index) => (
          <Box key={section.id}>
            <Typography variant="overline" color="text.secondary">
              SECTION {index + 1}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
              {section.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {section.description}
            </Typography>

            <List dense disablePadding sx={{ mt: 1 }}>
              {section.blocks.map((block) => (
                <ListItemButton
                  key={block.id}
                  selected={selectedBlockId === block.id}
                  onClick={() => onSelectBlock(block.id)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <DescriptionRounded fontSize="small" sx={{ mr: 1 }} />
                  <ListItemText
                    primary={block.label}
                    secondary={block.type}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: selectedBlockId === block.id ? 700 : 500,
                    }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
