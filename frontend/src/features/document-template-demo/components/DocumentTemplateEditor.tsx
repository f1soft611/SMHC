import AddBoxRounded from '@mui/icons-material/AddBoxRounded';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import BorderColorRounded from '@mui/icons-material/BorderColorRounded';
import CallSplitRounded from '@mui/icons-material/CallSplitRounded';
import CheckBoxRounded from '@mui/icons-material/CheckBoxRounded';
import ContentCutRounded from '@mui/icons-material/ContentCutRounded';
import FormatAlignCenterRounded from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignLeftRounded from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRounded from '@mui/icons-material/FormatAlignRightRounded';
import FormatColorFillRounded from '@mui/icons-material/FormatColorFillRounded';
import FormatColorTextRounded from '@mui/icons-material/FormatColorTextRounded';
import FormatBoldRounded from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRounded from '@mui/icons-material/FormatItalicRounded';
import SplitscreenRounded from '@mui/icons-material/SplitscreenRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import TableRowsRounded from '@mui/icons-material/TableRowsRounded';
import TitleRounded from '@mui/icons-material/TitleRounded';
import VerticalAlignBottomRounded from '@mui/icons-material/VerticalAlignBottomRounded';
import VerticalAlignCenterRounded from '@mui/icons-material/VerticalAlignCenterRounded';
import VerticalAlignTopRounded from '@mui/icons-material/VerticalAlignTopRounded';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { mergeAttributes } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

type CellBorderStyle = 'solid' | 'dashed' | 'double' | 'none';

type TableCellCustomAttributes = {
  backgroundColor?: string | null;
  verticalAlign?: 'top' | 'middle' | 'bottom' | null;
  borderColor?: string | null;
  borderWidth?: string | null;
  borderStyle?: CellBorderStyle | null;
};

const buildTableCellStyle = (attributes: TableCellCustomAttributes) => {
  const styles: string[] = [];

  if (attributes.backgroundColor) {
    styles.push(`background-color: ${attributes.backgroundColor}`);
  }

  if (attributes.verticalAlign && attributes.verticalAlign !== 'top') {
    styles.push(`vertical-align: ${attributes.verticalAlign}`);
  }

  if (attributes.borderStyle === 'none') {
    styles.push('border: none');
  } else if (
    attributes.borderStyle ||
    attributes.borderColor ||
    attributes.borderWidth
  ) {
    styles.push(`border-style: ${attributes.borderStyle ?? 'solid'}`);

    if (attributes.borderColor) {
      styles.push(`border-color: ${attributes.borderColor}`);
    }

    if (attributes.borderWidth) {
      styles.push(`border-width: ${attributes.borderWidth}`);
    }
  }

  return styles.join('; ');
};

const buildTableCellHTMLAttributes = (
  attributes: TableCellCustomAttributes,
) => {
  const htmlAttributes: Record<string, string> = {};

  if (attributes.backgroundColor) {
    htmlAttributes['data-cell-background'] = attributes.backgroundColor;
  }

  if (attributes.verticalAlign && attributes.verticalAlign !== 'top') {
    htmlAttributes['data-cell-vertical-align'] = attributes.verticalAlign;
  }

  if (attributes.borderColor) {
    htmlAttributes['data-cell-border-color'] = attributes.borderColor;
  }

  if (attributes.borderWidth) {
    htmlAttributes['data-cell-border-width'] = attributes.borderWidth;
  }

  if (attributes.borderStyle) {
    htmlAttributes['data-cell-border-style'] = attributes.borderStyle;
  }

  const style = buildTableCellStyle(attributes);
  if (style) {
    htmlAttributes.style = style;
  }

  return htmlAttributes;
};

const createTableCellAttributes = (
  parentAttributes: Record<string, unknown> | undefined,
) => {
  return {
    ...parentAttributes,
    backgroundColor: {
      default: null,
      parseHTML: (element: HTMLElement) =>
        element.getAttribute('data-cell-background') ??
        element.style.backgroundColor ??
        null,
    },
    verticalAlign: {
      default: 'top',
      parseHTML: (element: HTMLElement) =>
        element.getAttribute('data-cell-vertical-align') ??
        element.style.verticalAlign ??
        'top',
    },
    borderColor: {
      default: null,
      parseHTML: (element: HTMLElement) =>
        element.getAttribute('data-cell-border-color') ??
        element.style.borderColor ??
        null,
    },
    borderWidth: {
      default: null,
      parseHTML: (element: HTMLElement) =>
        element.getAttribute('data-cell-border-width') ??
        element.style.borderWidth ??
        null,
    },
    borderStyle: {
      default: null,
      parseHTML: (element: HTMLElement) =>
        (element.getAttribute(
          'data-cell-border-style',
        ) as CellBorderStyle | null) ??
        (element.style.borderStyle as CellBorderStyle | '') ??
        null,
    },
  };
};

const ColorableTableCell = TableCell.extend({
  addAttributes() {
    return createTableCellAttributes(this.parent?.());
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        buildTableCellHTMLAttributes(
          HTMLAttributes as TableCellCustomAttributes,
        ),
      ),
      0,
    ];
  },
});

const ColorableTableHeader = TableHeader.extend({
  addAttributes() {
    return createTableCellAttributes(this.parent?.());
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'th',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        buildTableCellHTMLAttributes(
          HTMLAttributes as TableCellCustomAttributes,
        ),
      ),
      0,
    ];
  },
});

const RichTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: Record<string, unknown>) => {
          const fontSize = attributes.fontSize as string | null;

          if (!fontSize) {
            return {};
          }

          return {
            style: `font-size: ${fontSize};`,
          };
        },
      },
    };
  },
});

interface DocumentTemplateEditorProps {
  content: string;
  onChange: (html: string) => void;
  title?: string;
  placeholder?: string;
  minHeight?: number;
  pageMode?: 'standard' | 'a4';
}

function ToolbarButton({
  title,
  onClick,
  children,
  disabled = false,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function ColorPickerControl({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Tooltip title={title}>
      <Box
        component="input"
        type="color"
        aria-label={title}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        sx={{
          width: 28,
          height: 28,
          p: 0,
          border: 'none',
          borderRadius: 1,
          bgcolor: 'transparent',
          cursor: 'pointer',
          '&::-webkit-color-swatch-wrapper': {
            p: 0,
          },
          '&::-webkit-color-swatch': {
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          },
        }}
      />
    </Tooltip>
  );
}

function StandardColorMenu({
  title,
  anchorEl,
  open,
  selectedColor,
  resetLabel,
  onClose,
  onSelectColor,
  onReset,
}: {
  title: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  selectedColor: string;
  resetLabel: string;
  onClose: () => void;
  onSelectColor: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Box sx={{ p: 1.5, width: 244 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          {title}
        </Typography>
        <Stack spacing={1.25} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onReset();
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            {resetLabel}
          </Button>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 0.75,
            }}
          >
            {standardExcelColors.map((color) => {
              const isActive =
                color.toLowerCase() === selectedColor.toLowerCase();

              return (
                <Box
                  key={color}
                  component="button"
                  type="button"
                  aria-label={`${title} ${color}`}
                  onClick={() => {
                    onSelectColor(color);
                    onClose();
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    boxShadow: isActive
                      ? '0 0 0 2px rgba(11, 107, 111, 0.16)'
                      : 'none',
                    bgcolor: color,
                    cursor: 'pointer',
                    p: 0,
                  }}
                />
              );
            })}
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              사용자 지정
            </Typography>
            <ColorPickerControl
              title={`${title} 사용자 지정`}
              value={selectedColor}
              onChange={onSelectColor}
            />
          </Stack>
        </Stack>
      </Box>
    </Menu>
  );
}

function TableBorderMenu({
  anchorEl,
  open,
  selectedColor,
  onClose,
  onApplyBorder,
  onSelectColor,
  onReset,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  selectedColor: string;
  onClose: () => void;
  onApplyBorder: (style: CellBorderStyle, width?: string) => void;
  onSelectColor: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Box sx={{ p: 1.5, width: 260 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          셀 테두리
        </Typography>
        <Stack spacing={0.75} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onApplyBorder('solid');
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            전체 테두리
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onApplyBorder('solid', '2px');
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            굵은 테두리
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onApplyBorder('dashed');
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            점선 테두리
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onApplyBorder('double', '3px');
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            이중 테두리
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              onReset();
              onClose();
            }}
            sx={{ justifyContent: 'flex-start' }}
          >
            테두리 제거
          </Button>
        </Stack>
        <Divider sx={{ my: 1.25 }} />
        <Typography variant="caption" color="text.secondary">
          테두리 색상
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 0.75,
            mt: 1,
          }}
        >
          {standardExcelColors.map((color) => {
            const isActive =
              color.toLowerCase() === selectedColor.toLowerCase();

            return (
              <Box
                key={color}
                component="button"
                type="button"
                aria-label={`테두리 색상 ${color}`}
                onClick={() => {
                  onSelectColor(color);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  boxShadow: isActive
                    ? '0 0 0 2px rgba(11, 107, 111, 0.16)'
                    : 'none',
                  bgcolor: color,
                  cursor: 'pointer',
                  p: 0,
                }}
              />
            );
          })}
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 1.25 }}
        >
          <Typography variant="caption" color="text.secondary">
            사용자 지정
          </Typography>
          <ColorPickerControl
            title="테두리 색상 사용자 지정"
            value={selectedColor}
            onChange={onSelectColor}
          />
        </Stack>
      </Box>
    </Menu>
  );
}

const fontOptions = [
  {
    label: 'Pretendard',
    value: 'Pretendard, "Plus Jakarta Sans", "Segoe UI", sans-serif',
  },
  {
    label: 'Plus Jakarta Sans',
    value: '"Plus Jakarta Sans", Pretendard, "Segoe UI", sans-serif',
  },
  {
    label: 'Segoe UI',
    value: '"Segoe UI", Pretendard, sans-serif',
  },
  {
    label: 'Noto Serif',
    value: '"Times New Roman", Georgia, serif',
  },
];

const fontSizeOptions = [
  '12px',
  '13px',
  '14px',
  '15px',
  '16px',
  '18px',
  '20px',
  '24px',
];

const standardExcelColors = [
  '#000000',
  '#7f7f7f',
  '#c00000',
  '#ff0000',
  '#ffc000',
  '#ffff00',
  '#92d050',
  '#00b050',
  '#00b0f0',
  '#0070c0',
  '#002060',
  '#7030a0',
  '#ffffff',
  '#f2f2f2',
  '#d9d9d9',
  '#bdd7ee',
  '#ddebf7',
  '#e2f0d9',
];

export function DocumentTemplateEditor({
  content,
  onChange,
  title = '템플릿 편집기',
  placeholder = 'AI 초안 이후 관리자가 제목, 문단, 체크리스트, 표를 수정하는 영역입니다.',
  minHeight = 520,
  pageMode = 'standard',
}: DocumentTemplateEditorProps) {
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [fontSize, setFontSize] = useState('15px');
  const [textColor, setTextColor] = useState('#0f172a');
  const [highlightColor, setHighlightColor] = useState('#f7f3d0');
  const [cellBackgroundColor, setCellBackgroundColor] = useState('#d8e6f5');
  const [cellBorderColor, setCellBorderColor] = useState('#7f7f7f');
  const [textColorMenuAnchor, setTextColorMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [highlightColorMenuAnchor, setHighlightColorMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [cellColorMenuAnchor, setCellColorMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [cellBorderMenuAnchor, setCellBorderMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [tableMenuAnchor, setTableMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      RichTextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      ColorableTableHeader,
      ColorableTableCell,
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  const applyCellBackground = (backgroundColor: string | null) => {
    editor
      ?.chain()
      .focus()
      .setCellAttribute('backgroundColor', backgroundColor)
      .run();
  };

  const applyCellVerticalAlign = (
    verticalAlign: 'top' | 'middle' | 'bottom',
  ) => {
    editor
      ?.chain()
      .focus()
      .setCellAttribute('verticalAlign', verticalAlign)
      .run();
  };

  const applyCellBorder = (
    borderStyle: CellBorderStyle,
    borderWidth = '1px',
  ) => {
    const chain = editor?.chain().focus();

    if (!chain) {
      return;
    }

    if (borderStyle === 'none') {
      chain
        .setCellAttribute('borderStyle', 'none')
        .setCellAttribute('borderColor', null)
        .setCellAttribute('borderWidth', '0')
        .run();
      return;
    }

    chain
      .setCellAttribute('borderStyle', borderStyle)
      .setCellAttribute('borderColor', cellBorderColor)
      .setCellAttribute('borderWidth', borderWidth)
      .run();
  };

  const isTableMenuOpen = Boolean(tableMenuAnchor);

  const selectedFontLabel = useMemo(
    () =>
      fontOptions.find((option) => option.value === fontFamily)?.label ??
      'Pretendard',
    [fontFamily],
  );
  const activeAlignment = useMemo(() => {
    if (editor?.isActive({ textAlign: 'center' })) {
      return 'center';
    }

    if (editor?.isActive({ textAlign: 'right' })) {
      return 'right';
    }

    return 'left';
  }, [editor, editor?.state]);
  const isA4Mode = pageMode === 'a4';
  const editorCanvasMinHeight = isA4Mode
    ? Math.max(minHeight - 60, 980)
    : Math.max(minHeight - 60, 180);

  const insertBaseTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 4, withHeaderRow: false })
      .run();
  };

  const handleSetFontSize = (value: string) => {
    setFontSize(value);
    editor?.chain().focus().setMark('textStyle', { fontSize: value }).run();
  };

  const handleSetTextColor = (value: string) => {
    setTextColor(value);
    editor?.chain().focus().setColor(value).run();
  };

  const handleSetHighlightColor = (value: string) => {
    setHighlightColor(value);
    editor?.chain().focus().setHighlight({ color: value }).run();
  };

  const handleSetCellBackgroundColor = (value: string) => {
    setCellBackgroundColor(value);
    applyCellBackground(value);
  };

  const handleResetTextColor = () => {
    setTextColor('#0f172a');
    editor?.chain().focus().unsetColor().run();
  };

  const handleResetHighlightColor = () => {
    setHighlightColor('#f7f3d0');
    editor?.chain().focus().unsetHighlight().run();
  };

  const handleResetCellBackgroundColor = () => {
    setCellBackgroundColor('#d8e6f5');
    applyCellBackground(null);
  };

  const handleSetCellBorderColor = (value: string) => {
    setCellBorderColor(value);
    editor
      ?.chain()
      .focus()
      .setCellAttribute('borderStyle', 'solid')
      .setCellAttribute('borderColor', value)
      .setCellAttribute('borderWidth', '1px')
      .run();
  };

  const handleResetCellBorder = () => {
    setCellBorderColor('#7f7f7f');
    applyCellBorder('none');
  };

  const handleOpenTableMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setTableMenuAnchor(event.currentTarget);
  };

  const handleOpenTextColorMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setTextColorMenuAnchor(event.currentTarget);
  };

  const handleOpenHighlightColorMenu = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    setHighlightColorMenuAnchor(event.currentTarget);
  };

  const handleOpenCellColorMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setCellColorMenuAnchor(event.currentTarget);
  };

  const handleOpenCellBorderMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setCellBorderMenuAnchor(event.currentTarget);
  };

  const handleCloseTableMenu = () => {
    setTableMenuAnchor(null);
  };

  const handleCloseTextColorMenu = () => {
    setTextColorMenuAnchor(null);
  };

  const handleCloseHighlightColorMenu = () => {
    setHighlightColorMenuAnchor(null);
  };

  const handleCloseCellColorMenu = () => {
    setCellColorMenuAnchor(null);
  };

  const handleCloseCellBorderMenu = () => {
    setCellBorderMenuAnchor(null);
  };

  const runTableCommand = (command: () => void) => {
    command();
    handleCloseTableMenu();
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, {
        emitUpdate: false,
      });
    }
  }, [content, editor]);

  return (
    <Paper
      sx={{
        borderRadius: 0,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: 'grey.50',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 144 }}>
            <Select
              value={fontFamily}
              onChange={(event) => setFontFamily(event.target.value)}
              displayEmpty
              size="small"
              sx={{
                fontSize: 13,
                '& .MuiSelect-select': {
                  py: 0.75,
                },
              }}
              renderValue={() => `${selectedFontLabel} 폰트`}
            >
              {fontOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 88 }}>
            <Select
              value={fontSize}
              onChange={(event) => handleSetFontSize(event.target.value)}
              size="small"
              sx={{
                fontSize: 13,
                '& .MuiSelect-select': {
                  py: 0.75,
                },
              }}
              renderValue={(value) => `${value}`}
            >
              {fontSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <ToolbarButton
          title="굵게"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
        >
          <FormatBoldRounded fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          title="기울임"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
        >
          <FormatItalicRounded fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          title="제목 추가"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={!editor}
        >
          <TitleRounded fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          title="체크리스트"
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          disabled={!editor}
        >
          <CheckBoxRounded fontSize="small" />
        </ToolbarButton>
        <Divider orientation="vertical" flexItem />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={activeAlignment}
          onChange={(_event, value: 'left' | 'center' | 'right' | null) => {
            if (!value) {
              return;
            }

            editor?.chain().focus().setTextAlign(value).run();
          }}
        >
          <ToggleButton value="left">
            <FormatAlignLeftRounded fontSize="small" />
          </ToggleButton>
          <ToggleButton value="center">
            <FormatAlignCenterRounded fontSize="small" />
          </ToggleButton>
          <ToggleButton value="right">
            <FormatAlignRightRounded fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
        <Divider orientation="vertical" flexItem />
        <ToolbarButton
          title="표 삽입"
          onClick={insertBaseTable}
          disabled={!editor}
        >
          <TableRowsRounded fontSize="small" />
        </ToolbarButton>
        <Button
          size="small"
          variant="outlined"
          startIcon={<TableRowsRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={handleOpenTableMenu}
          disabled={!editor}
          sx={{ whiteSpace: 'nowrap' }}
        >
          표 편집
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          size="small"
          variant="outlined"
          startIcon={<FormatColorTextRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={handleOpenTextColorMenu}
          disabled={!editor}
          sx={{
            whiteSpace: 'nowrap',
            borderBottom: `3px solid ${textColor}`,
          }}
        >
          글자색
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FormatColorFillRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={handleOpenHighlightColorMenu}
          disabled={!editor}
          sx={{
            whiteSpace: 'nowrap',
            borderBottom: `3px solid ${highlightColor}`,
          }}
        >
          배경색
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<BorderColorRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={handleOpenCellColorMenu}
          disabled={!editor}
          sx={{
            whiteSpace: 'nowrap',
            borderBottom: `3px solid ${cellBackgroundColor}`,
          }}
        >
          셀 색상
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<BorderColorRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={handleOpenCellBorderMenu}
          disabled={!editor}
          sx={{
            whiteSpace: 'nowrap',
            borderBottom: `3px solid ${cellBorderColor}`,
          }}
        >
          테두리
        </Button>
      </Stack>

      <Divider />

      <StandardColorMenu
        title="글자 색상"
        anchorEl={textColorMenuAnchor}
        open={Boolean(textColorMenuAnchor)}
        selectedColor={textColor}
        resetLabel="자동"
        onClose={handleCloseTextColorMenu}
        onSelectColor={handleSetTextColor}
        onReset={handleResetTextColor}
      />

      <StandardColorMenu
        title="글씨 배경 색상"
        anchorEl={highlightColorMenuAnchor}
        open={Boolean(highlightColorMenuAnchor)}
        selectedColor={highlightColor}
        resetLabel="배경 제거"
        onClose={handleCloseHighlightColorMenu}
        onSelectColor={handleSetHighlightColor}
        onReset={handleResetHighlightColor}
      />

      <StandardColorMenu
        title="셀 배경 색상"
        anchorEl={cellColorMenuAnchor}
        open={Boolean(cellColorMenuAnchor)}
        selectedColor={cellBackgroundColor}
        resetLabel="셀 배경 제거"
        onClose={handleCloseCellColorMenu}
        onSelectColor={handleSetCellBackgroundColor}
        onReset={handleResetCellBackgroundColor}
      />

      <TableBorderMenu
        anchorEl={cellBorderMenuAnchor}
        open={Boolean(cellBorderMenuAnchor)}
        selectedColor={cellBorderColor}
        onClose={handleCloseCellBorderMenu}
        onApplyBorder={applyCellBorder}
        onSelectColor={handleSetCellBorderColor}
        onReset={handleResetCellBorder}
      />

      <Menu
        anchorEl={tableMenuAnchor}
        open={isTableMenuOpen}
        onClose={handleCloseTableMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              insertBaseTable();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TableRowsRounded fontSize="small" />
            <Typography variant="body2">표 삽입</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().addRowAfter().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AddBoxRounded fontSize="small" />
            <Typography variant="body2">행 추가</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().addColumnAfter().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <BorderColorRounded fontSize="small" />
            <Typography variant="body2">열 추가</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().deleteRow().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <RemoveRounded fontSize="small" />
            <Typography variant="body2">행 삭제</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().deleteColumn().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ContentCutRounded fontSize="small" />
            <Typography variant="body2">열 삭제</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().mergeCells().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SplitscreenRounded fontSize="small" />
            <Typography variant="body2">셀 병합</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              editor?.chain().focus().splitCell().run();
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CallSplitRounded fontSize="small" />
            <Typography variant="body2">병합 해제</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              applyCellVerticalAlign('top');
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <VerticalAlignTopRounded fontSize="small" />
            <Typography variant="body2">위 정렬</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              applyCellVerticalAlign('middle');
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <VerticalAlignCenterRounded fontSize="small" />
            <Typography variant="body2">가운데 정렬</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() =>
            runTableCommand(() => {
              applyCellVerticalAlign('bottom');
            })
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <VerticalAlignBottomRounded fontSize="small" />
            <Typography variant="body2">아래 정렬</Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Box
        sx={{
          minHeight,
          p: { xs: 2, md: 3 },
          bgcolor: isA4Mode ? 'grey.100' : 'common.white',
          display: 'flex',
          justifyContent: 'center',
          '& .tiptap': {
            outline: 'none',
            minHeight: editorCanvasMinHeight,
            color: 'text.primary',
            fontSize: 15,
            lineHeight: 1.7,
            fontFamily,
            width: '100%',
            maxWidth: isA4Mode ? 794 : 'none',
            mx: 'auto',
            bgcolor: 'common.white',
            boxShadow: isA4Mode ? '0 16px 36px rgba(12, 53, 59, 0.12)' : 'none',
            borderRadius: isA4Mode ? 1 : 0,
            px: { xs: 3, md: isA4Mode ? 6 : 0 },
            py: { xs: 3, md: isA4Mode ? 5.5 : 0 },
          },
          '& .tiptap h1': {
            fontSize: 32,
            lineHeight: 1.2,
            mb: 1.5,
          },
          '& .tiptap h2': {
            fontSize: 22,
            lineHeight: 1.3,
            mt: 3,
            mb: 1,
          },
          '& .tiptap p': {
            my: 1,
          },
          '& .tiptap mark': {
            borderRadius: 6,
            padding: '0.1rem 0.35rem',
            boxDecorationBreak: 'clone',
          },
          '& .tiptap ul[data-type="taskList"]': {
            pl: 0,
            listStyle: 'none',
          },
          '& .tiptap ul[data-type="taskList"] li': {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
            my: 0.9,
          },
          '& .tiptap ul[data-type="taskList"] li:has(> div > p[style*="text-align: center"]), & .tiptap ul[data-type="taskList"] li:has(> p[style*="text-align: center"])':
            {
              justifyContent: 'center',
            },
          '& .tiptap ul[data-type="taskList"] li:has(> div > p[style*="text-align: right"]), & .tiptap ul[data-type="taskList"] li:has(> p[style*="text-align: right"])':
            {
              justifyContent: 'flex-end',
            },
          '& .tiptap ul[data-type="taskList"] li > label': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            mt: '6px',
            lineHeight: 1,
          },
          '& .tiptap ul[data-type="taskList"] li:has(> div > p[style*="text-align: center"]) > div, & .tiptap ul[data-type="taskList"] li:has(> p[style*="text-align: center"]) > div, & .tiptap ul[data-type="taskList"] li:has(> div > p[style*="text-align: right"]) > div, & .tiptap ul[data-type="taskList"] li:has(> p[style*="text-align: right"]) > div':
            {
              flex: '0 1 auto',
            },
          '& .tiptap ul[data-type="taskList"] li > label input': {
            width: 16,
            height: 16,
            margin: 0,
          },
          '& .tiptap ul[data-type="taskList"] li > div': {
            flex: 1,
            minWidth: 0,
          },
          '& .tiptap ul[data-type="taskList"] li > div > p, & .tiptap ul[data-type="taskList"] li > p':
            {
              margin: 0,
            },
          '& .tiptap table': {
            borderCollapse: 'collapse',
            width: '100%',
            my: 2,
            tableLayout: 'fixed',
          },
          '& .tiptap th, & .tiptap td': {
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
            verticalAlign: 'top',
            position: 'relative',
            fontFamily,
          },
          '& .tiptap th': {
            bgcolor: 'common.white',
            fontWeight: 700,
          },
          '& .tiptap .selectedCell::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: '2px solid',
            borderColor: 'primary.main',
            pointerEvents: 'none',
          },
          '& .tiptap .column-resize-handle': {
            position: 'absolute',
            right: -2,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: 'primary.main',
            opacity: 0.35,
            pointerEvents: 'none',
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
