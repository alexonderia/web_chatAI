import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/material/styles';

interface AdvancedSettingsPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  temperature: number;
  maxTokens: number;
  onSave: (settings: { temperature: number; maxTokens: number }) => void;
}

export function AdvancedSettingsPopover({
  anchorEl,
  open,
  onClose,
  temperature,
  maxTokens,
  onSave,
}: AdvancedSettingsPopoverProps) {
  const [localTemperature, setLocalTemperature] = useState(temperature);
  const [localMaxTokens, setLocalMaxTokens] = useState(maxTokens);

  useEffect(() => {
    if (!open) return;

    setLocalTemperature(temperature);
    setLocalMaxTokens(maxTokens);
  }, [open, temperature, maxTokens]);


  const temperatureMarks = [
    { value: 0, label: '0' },
    { value: 2, label: '2' },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          p: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          overflow: 'visible',
        },
      }}
    >
      <Card
        variant="outlined"
        sx={(theme) => ({
          minWidth: 260,
          maxWidth: 280,
          borderRadius: 1.2,
          borderColor: alpha(theme.palette.grey[400], 0.8),
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 18px 60px rgba(0, 46, 106, 0.18)',
        })}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                Температура
              </Typography>
              <Tooltip
                title={
                  <>
                    <Typography fontWeight={600}>Что такое температура?</Typography>
                    <Typography variant="body2">
                      Это параметр, который управляет степенью случайности при генерации текста.<br />
                      0 — последовательные и предсказуемые ответы.<br />
                      2 — креативные и непредсказуемые ответы.
                    </Typography>
                  </>
                }
                enterTouchDelay={0}
                arrow
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary', cursor: 'pointer' }}
                />
              </Tooltip>
            </Stack>

            <Slider
              min={0}
              max={2}
              step={0.1}
              value={localTemperature}
              marks={temperatureMarks}
              valueLabelDisplay="auto"
              onChange={(_, value) => setLocalTemperature(value as number)}
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Максимальная длина ответа
              </Typography>
              <InputBase
                value={localMaxTokens}
                onChange={(e) => setLocalMaxTokens(Number(e.target.value) || 0)}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 999,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: 14,
                  color: 'text.primary',
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: 'none', color: 'text.primary' }}
                onClick={() => {
                   setLocalTemperature(temperature);
                    setLocalMaxTokens(maxTokens);
                }}
              >
                Сбросить
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => onSave({ temperature: localTemperature, maxTokens: localMaxTokens })}
              >
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}