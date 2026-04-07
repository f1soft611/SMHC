import DataObjectRounded from '@mui/icons-material/DataObjectRounded';
import EditNoteRounded from '@mui/icons-material/EditNoteRounded';
import {
  Alert,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { DemoTemplateBlock } from '../types/documentTemplateDemo';

interface TemplatePropertyPanelProps {
  selectedBlock: DemoTemplateBlock | null;
  schemaJson: string;
  onChange: (updates: {
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
  }) => void;
}

export function TemplatePropertyPanel({
  selectedBlock,
  schemaJson,
  onChange,
}: TemplatePropertyPanelProps) {
  return (
    <Stack spacing={2}>
      <Paper sx={{ borderRadius: 3, p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EditNoteRounded color="secondary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              블록 속성
            </Typography>
          </Stack>

          {selectedBlock ? (
            <>
              <TextField
                label="라벨"
                size="small"
                value={selectedBlock.label}
                onChange={(event) => onChange({ label: event.target.value })}
              />
              <TextField
                label="설명"
                size="small"
                multiline
                minRows={3}
                value={selectedBlock.description}
                onChange={(event) =>
                  onChange({ description: event.target.value })
                }
              />
              <TextField
                label="Placeholder"
                size="small"
                value={selectedBlock.placeholder ?? ''}
                onChange={(event) =>
                  onChange({ placeholder: event.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedBlock.required}
                    onChange={(event) =>
                      onChange({ required: event.target.checked })
                    }
                  />
                }
                label="필수 입력 블록"
              />
              <Alert severity="info">
                속성 패널은 후속 블록형 작성기와 연동될 메타데이터 영역입니다.
                현재 데모에서는 템플릿 JSON과 좌측 구조 목록에 반영됩니다.
              </Alert>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              좌측에서 블록을 선택하면 속성을 편집할 수 있습니다.
            </Typography>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 3, p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <DataObjectRounded color="info" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              템플릿 JSON
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            실제 AI가 반환할 초안과, 이후 저장 시 서버가 검증할 스키마 형식을
            단순화해 보여줍니다.
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              maxHeight: 320,
              overflow: 'auto',
              bgcolor: 'grey.950',
            }}
          >
            <Typography
              component="pre"
              sx={{
                m: 0,
                color: 'grey.100',
                fontSize: 12,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {schemaJson}
            </Typography>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}
