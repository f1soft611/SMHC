import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRounded from '@mui/icons-material/RemoveCircleRounded';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type {
  CorrectiveActionRow,
  DemoDocumentFormData,
  MonitoringRow,
  SuitabilityValue,
} from '../types/documentTemplateDemo';

interface InteractiveCcpDocumentViewProps {
  data: DemoDocumentFormData;
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
}: {
  value: string;
  onChange: (value: string) => void;
  align?: 'left' | 'center';
  multiline?: boolean;
}) {
  return (
    <InputBase
      value={value}
      onChange={(event) => onChange(event.target.value)}
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      fullWidth
      sx={{
        fontSize: 14,
        textAlign: align,
        '& input, & textarea': {
          textAlign: align,
          px: 0.5,
        },
      }}
    />
  );
}

export function InteractiveCcpDocumentView({
  data,
  onChangeField,
  onChangeMonitoringRow,
  onAddMonitoringRow,
  onRemoveMonitoringRow,
  onChangeCorrectiveRow,
  onChangeRichTextField,
  onAddCorrectiveRow,
  onRemoveCorrectiveRow,
}: InteractiveCcpDocumentViewProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        minHeight: 260,
        bgcolor: 'grey.50',
      }}
    >
      <Paper sx={{ overflow: 'hidden', border: '2px solid #1f1f1f' }}>
        <Stack spacing={0} sx={{ bgcolor: 'common.white' }}>
          <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle, py: 2 }}>
            <Typography variant="h5" fontWeight={800}>
              {data.documentTitle}
            </Typography>
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
              />
            </Box>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>점검자</Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.inspector}
                onChange={(value) => onChangeField('inspector', value)}
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
              />
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.heatingTimeCriteria}
                onChange={(value) =>
                  onChangeField('heatingTimeCriteria', value)
                }
              />
            </Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.coreTemperatureCriteria}
                onChange={(value) =>
                  onChangeField('coreTemperatureCriteria', value)
                }
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '0.6fr 3fr' }}>
            <Box sx={{ ...tableCellBaseStyle, ...headerCellStyle }}>주기</Box>
            <Box sx={tableCellBaseStyle}>
              <CellInput
                value={data.frequency}
                onChange={(value) => onChangeField('frequency', value)}
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
              />
            </Box>
          </Box>

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
                <>
                  <Box key={`${row.id}-date`} sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.workDate}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'workDate', value)
                      }
                    />
                  </Box>
                  <Box key={`${row.id}-start`} sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingStartTime}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'heatingStartTime', value)
                      }
                    />
                  </Box>
                  <Box key={`${row.id}-temp`} sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingTemperature}
                      onChange={(value) =>
                        onChangeMonitoringRow(
                          row.id,
                          'heatingTemperature',
                          value,
                        )
                      }
                    />
                  </Box>
                  <Box key={`${row.id}-end`} sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.heatingEndTime}
                      onChange={(value) =>
                        onChangeMonitoringRow(row.id, 'heatingEndTime', value)
                      }
                    />
                  </Box>
                  <Box key={`${row.id}-surface`} sx={tableCellBaseStyle}>
                    <CellInput
                      value={row.postHeatingSurfaceTemperature}
                      onChange={(value) =>
                        onChangeMonitoringRow(
                          row.id,
                          'postHeatingSurfaceTemperature',
                          value,
                        )
                      }
                    />
                  </Box>
                  <Box
                    key={`${row.id}-fit`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <Checkbox
                      checked={row.suitability === '적합'}
                      onChange={(_, checked) =>
                        onChangeMonitoringRow(
                          row.id,
                          'suitability',
                          checked ? '적합' : null,
                        )
                      }
                    />
                  </Box>
                  <Box
                    key={`${row.id}-unfit`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <Checkbox
                      checked={row.suitability === '부적합'}
                      onChange={(_, checked) =>
                        onChangeMonitoringRow(
                          row.id,
                          'suitability',
                          checked ? '부적합' : null,
                        )
                      }
                    />
                  </Box>
                  <Box
                    key={`${row.id}-action`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveMonitoringRow(row.id)}
                      disabled={data.monitoringRows.length === 1}
                      sx={{ width: 28, height: 28 }}
                    >
                      <RemoveCircleRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              ))}
            </Box>
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                px: 1,
                py: 1,
                borderTop: '1px solid #1f1f1f',
                bgcolor: 'common.white',
              }}
            >
              <Button
                size="small"
                color="success"
                variant="outlined"
                startIcon={<AddCircleRounded />}
                onClick={onAddMonitoringRow}
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
                <>
                  <Box
                    key={`${row.id}-detail`}
                    sx={{ ...tableCellBaseStyle, minHeight: 90 }}
                  >
                    <CellInput
                      value={row.deviationDetail}
                      onChange={(value) =>
                        onChangeCorrectiveRow(row.id, 'deviationDetail', value)
                      }
                      align="left"
                      multiline
                    />
                  </Box>
                  <Box
                    key={`${row.id}-result`}
                    sx={{ ...tableCellBaseStyle, minHeight: 90 }}
                  >
                    <CellInput
                      value={row.actionResult}
                      onChange={(value) =>
                        onChangeCorrectiveRow(row.id, 'actionResult', value)
                      }
                      align="left"
                      multiline
                    />
                  </Box>
                  <Box
                    key={`${row.id}-taken`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <Checkbox
                      checked={row.actionTaken}
                      onChange={(_, checked) =>
                        onChangeCorrectiveRow(row.id, 'actionTaken', checked)
                      }
                    />
                  </Box>
                  <Box
                    key={`${row.id}-report`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <Checkbox
                      checked={row.reportedToManager}
                      onChange={(_, checked) =>
                        onChangeCorrectiveRow(
                          row.id,
                          'reportedToManager',
                          checked,
                        )
                      }
                    />
                  </Box>
                  <Box
                    key={`${row.id}-action`}
                    sx={{ ...tableCellBaseStyle, textAlign: 'center' }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveCorrectiveRow(row.id)}
                      disabled={data.correctiveRows.length === 1}
                      sx={{ width: 28, height: 28 }}
                    >
                      <RemoveCircleRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              ))}
            </Box>
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                px: 1,
                py: 1,
                borderTop: '1px solid #1f1f1f',
                bgcolor: 'common.white',
              }}
            >
              <Button
                size="small"
                color="success"
                variant="outlined"
                startIcon={<AddCircleRounded />}
                onClick={onAddCorrectiveRow}
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
