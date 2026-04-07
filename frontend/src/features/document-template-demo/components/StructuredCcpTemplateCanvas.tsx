import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRounded from '@mui/icons-material/RemoveCircleRounded';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Fragment } from 'react';
import type {
  CorrectiveActionRow,
  DemoDocumentFormData,
  MonitoringRow,
  SuitabilityValue,
} from '../types/documentTemplateDemo';

interface StructuredCcpTemplateCanvasProps {
  data: DemoDocumentFormData;
  mode?: 'template' | 'journal-draft' | 'journal-readonly';
  onChangeField: (
    field: Exclude<
      keyof DemoDocumentFormData,
      | 'monitoringRows'
      | 'correctiveRows'
      | 'monitoringMethodText'
      | 'correctiveMethodText'
    >,
    value: string,
  ) => void;
  onChangeMonitoringRow: (
    rowId: string,
    field: Exclude<keyof MonitoringRow, 'id'>,
    value: string | SuitabilityValue,
  ) => void;
  onAddMonitoringRow: () => void;
  onRemoveMonitoringRow: (rowId: string) => void;
  onChangeCorrectiveRow: (
    rowId: string,
    field: Exclude<keyof CorrectiveActionRow, 'id'>,
    value: string | boolean,
  ) => void;
  onChangeRichTextField: (
    field: 'monitoringMethodText' | 'correctiveMethodText',
    value: string,
  ) => void;
  onAddCorrectiveRow: () => void;
  onRemoveCorrectiveRow: (rowId: string) => void;
}

const headerCellStyle = {
  backgroundColor: '#c8daee',
  fontWeight: 700,
  textAlign: 'center',
};

const tableCellBaseStyle = {
  border: '1px solid #1f1f1f',
  px: 1,
  py: 1,
  fontSize: 14,
  verticalAlign: 'middle',
};

function CellInput({
  value,
  onChange,
  align = 'center',
  multiline = false,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  align?: 'left' | 'center';
  multiline?: boolean;
  readOnly?: boolean;
}) {
  return (
    <InputBase
      value={value}
      onChange={(event) => onChange(event.target.value)}
      readOnly={readOnly}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      fullWidth
      sx={{
        fontSize: 14,
        textAlign: align,
        bgcolor: readOnly ? 'grey.100' : 'transparent',
        '& input, & textarea': {
          textAlign: align,
          px: 0.5,
          cursor: readOnly ? 'default' : 'text',
        },
      }}
    />
  );
}

export function StructuredCcpTemplateCanvas({
  data,
  mode = 'template',
  onChangeField,
  onChangeMonitoringRow,
  onAddMonitoringRow,
  onRemoveMonitoringRow,
  onChangeCorrectiveRow,
  onChangeRichTextField,
  onAddCorrectiveRow,
  onRemoveCorrectiveRow,
}: StructuredCcpTemplateCanvasProps) {
  const isJournalMode = mode !== 'template';
  const isReadOnly = mode === 'journal-readonly';
  const isTemplateLocked = isJournalMode;

  return (
    <Paper
      sx={{
        borderRadius: 0,
        p: 0,
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: alpha('#1f1f1f', 0.16),
      }}
    >
      <Paper
        sx={{
          overflow: 'hidden',
          borderRadius: 0,
          border: '2px solid #1f1f1f',
          backgroundColor: '#fff',
        }}
      >
        <Stack spacing={0}>
          <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle, py: 2 }}>
            <CellInput
              value={data.documentTitle}
              onChange={(value) => onChangeField('documentTitle', value)}
              readOnly={isTemplateLocked}
            />
            <Typography variant="body2" sx={{ mt: 0.5, color: '#2457b7' }}>
              {data.processLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.4fr 0.6fr 0.8fr',
            }}
          >
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>
              작성 기간
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.period}
                onChange={(value) => onChangeField('period', value)}
                readOnly={isReadOnly}
              />
            </Box>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>점검자</Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.inspector}
                onChange={(value) => onChangeField('inspector', value)}
                readOnly={isReadOnly}
              />
            </Box>
          </Box>

          <Box
            sx={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr 1fr 1fr' }}
          >
            <Box
              sx={{
                ...tableCellBaseStyle,
                ...headerCellStyle,
                gridRow: '1 / span 2',
              }}
            >
              한계기준
            </Box>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>
              가열온도(℃)
            </Box>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>
              가열시간(분)
            </Box>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>
              중심온도
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.heatingTemperatureCriteria}
                onChange={(value) =>
                  onChangeField('heatingTemperatureCriteria', value)
                }
                readOnly={isTemplateLocked}
              />
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.heatingTimeCriteria}
                onChange={(value) =>
                  onChangeField('heatingTimeCriteria', value)
                }
                readOnly={isTemplateLocked}
              />
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.coreTemperatureCriteria}
                onChange={(value) =>
                  onChangeField('coreTemperatureCriteria', value)
                }
                readOnly={isTemplateLocked}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '0.6fr 3fr' }}>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>주기</Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.frequency}
                onChange={(value) => onChangeField('frequency', value)}
                readOnly={isTemplateLocked}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '0.6fr 3fr' }}>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>방법</Box>
            <Box sx={{ ...tableCellBaseStyle, py: 1.5 }}>
              <CellInput
                value={data.monitoringMethodText}
                onChange={(value) =>
                  onChangeRichTextField('monitoringMethodText', value)
                }
                align="left"
                multiline
                readOnly={isTemplateLocked}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#1f1f1f' }} />

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '0.8fr 1fr 1fr 1fr 1.1fr 0.8fr 0.8fr 56px',
              }}
            >
              {[
                '일',
                '가열시간(시작)',
                '가열온도(℃)',
                '가열시간(종료)',
                '가열후 표면온도(℃)',
                '적합',
                '부적합',
                '',
              ].map((label) => (
                <Box
                  key={label || 'actions'}
                  sx={{ ...tableCellBaseStyle, ...headerCellStyle }}
                >
                  {label}
                </Box>
              ))}

              {data.monitoringRows.map((row) => (
                <Fragment key={row.id}>
                  <Box sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.workDate}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'workDate', value)
                      }
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingStartTime}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'heatingStartTime', value)
                      }
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingTemperature}
                      onChange={(value) =>
                        onChangeMonitoringRow(
                          row.id,
                          'heatingTemperature',
                          value,
                        )
                      }
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingEndTime}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'heatingEndTime', value)
                      }
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.postHeatingSurfaceTemperature}
                      onChange={(value) =>
                        onChangeMonitoringRow(
                          row.id,
                          'postHeatingSurfaceTemperature',
                          value,
                        )
                      }
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={row.suitability === '적합'}
                      disabled={isReadOnly}
                      onChange={(_, checked) =>
                        onChangeMonitoringRow(
                          row.id,
                          'suitability',
                          checked ? '적합' : null,
                        )
                      }
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={row.suitability === '부적합'}
                      disabled={isReadOnly}
                      onChange={(_, checked) =>
                        onChangeMonitoringRow(
                          row.id,
                          'suitability',
                          checked ? '부적합' : null,
                        )
                      }
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveMonitoringRow(row.id)}
                      disabled={isReadOnly || data.monitoringRows.length === 1}
                      sx={{ width: 28, height: 28 }}
                    >
                      <RemoveCircleRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </Fragment>
              ))}
            </Box>

            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ px: 1, py: 1, borderTop: '1px solid #1f1f1f' }}
            >
              <Button
                size="small"
                color="success"
                variant="outlined"
                startIcon={<AddCircleRounded />}
                onClick={onAddMonitoringRow}
                disabled={isReadOnly}
              >
                행 추가
              </Button>
            </Stack>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '0.6fr 3fr' }}>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>
              개선조치 방법
            </Box>
            <Box sx={{ ...tableCellBaseStyle, py: 1.5 }}>
              <CellInput
                value={data.correctiveMethodText}
                onChange={(value) =>
                  onChangeRichTextField('correctiveMethodText', value)
                }
                align="left"
                multiline
                readOnly={isTemplateLocked}
              />
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.6fr 0.45fr 0.45fr 56px',
              }}
            >
              {[
                '한계 기준 이탈내용',
                '개선조치 및 결과',
                '조치',
                '보고',
                '',
              ].map((label) => (
                <Box
                  key={label || 'actions'}
                  sx={{ ...tableCellBaseStyle, ...headerCellStyle }}
                >
                  {label}
                </Box>
              ))}

              {data.correctiveRows.map((row) => (
                <Fragment key={row.id}>
                  <Box sx={{ ...tableCellBaseStyle, minHeight: 90 }}>
                    <CellInput
                      value={row.deviationDetail}
                      onChange={(value) =>
                        onChangeCorrectiveRow(row.id, 'deviationDetail', value)
                      }
                      align="left"
                      multiline
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, minHeight: 90 }}>
                    <CellInput
                      value={row.actionResult}
                      onChange={(value) =>
                        onChangeCorrectiveRow(row.id, 'actionResult', value)
                      }
                      align="left"
                      multiline
                      readOnly={isReadOnly}
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={row.actionTaken}
                      disabled={isReadOnly}
                      onChange={(_, checked) =>
                        onChangeCorrectiveRow(row.id, 'actionTaken', checked)
                      }
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={row.reportedToManager}
                      disabled={isReadOnly}
                      onChange={(_, checked) =>
                        onChangeCorrectiveRow(
                          row.id,
                          'reportedToManager',
                          checked,
                        )
                      }
                    />
                  </Box>
                  <Box sx={{ ...tableCellBaseStyle, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveCorrectiveRow(row.id)}
                      disabled={isReadOnly || data.correctiveRows.length === 1}
                      sx={{ width: 28, height: 28 }}
                    >
                      <RemoveCircleRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </Fragment>
              ))}
            </Box>

            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ px: 1, py: 1, borderTop: '1px solid #1f1f1f' }}
            >
              <Button
                size="small"
                color="success"
                variant="outlined"
                startIcon={<AddCircleRounded />}
                onClick={onAddCorrectiveRow}
                disabled={isReadOnly}
              >
                행 추가
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Paper>
  );
}
