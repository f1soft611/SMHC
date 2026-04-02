import {
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

interface ReliabilityCardProps {
  title: string;
  value: string;
  progress: number;
  tone?: 'primary' | 'secondary' | 'success';
}

export function ReliabilityCard({
  title,
  value,
  progress,
  tone = 'primary',
}: ReliabilityCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h5">{value}</Typography>
          <LinearProgress color={tone} value={progress} variant="determinate" />
        </Stack>
      </CardContent>
    </Card>
  );
}
