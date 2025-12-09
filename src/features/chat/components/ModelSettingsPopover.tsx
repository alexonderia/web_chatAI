import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export type ModelId = 'model-1' | 'model-2' | 'model-3';

interface ModelSettingsPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  model: ModelId;
  onModelChange: (model: ModelId) => void;
  onOpenAdvanced: (anchor: HTMLElement) => void;
  advancedOpen: boolean;
}

export function ModelSettingsPopover({
  anchorEl,
  open,
  onClose,
  model,
  onModelChange,
  onOpenAdvanced,
  advancedOpen,
}: ModelSettingsPopoverProps) {
  const handleSelectModel = (id: ModelId) => {
    onModelChange(id);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        elevation: 0,
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
          borderRadius: 1.2,
          borderColor: alpha(theme.palette.grey[400], 0.8),
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 18px 60px rgba(0, 46, 106, 0.18)',
        })}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              {[
                { id: 'model-1' as ModelId, label: 'Текущая модель' },
                { id: 'model-2' as ModelId, label: 'Модель 2' },
                { id: 'model-3' as ModelId, label: 'Модель 3' },
              ].map(({ id, label }) => {
                const selected = model === id;
                return (
                  <Button
                    key={id}
                    fullWidth
                    variant="text"
                    onClick={() => handleSelectModel(id)}
                    sx={{
                      justifyContent: 'space-between',
                      borderRadius: 999,
                      px: 1.5,
                      py: 0.75,
                      textTransform: 'none',
                      fontWeight: 500,
                      color: selected ? 'text.secondary' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {label}
                    {selected && <CheckIcon fontSize="small" />}
                  </Button>
                );
              })}
            </Stack>

            <Divider />

            <Button
              variant="text"
              color="inherit"
              onClick={(e) => onOpenAdvanced(e.currentTarget)}
              sx={(theme) => ({
                justifyContent: 'space-between',
                textTransform: 'none',
                color: 'text.primary',

                alignSelf: 'stretch',
                borderRadius: 1,
                px: 1.2,
                py: 0.75,
                minHeight: 40,

                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              })}
            >
              <Typography fontWeight={600}>Дополнительные настройки</Typography>
              {advancedOpen ? (
                <ChevronLeftIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}