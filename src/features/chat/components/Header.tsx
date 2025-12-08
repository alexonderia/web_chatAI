import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import logo from '@/assets/logo.svg';

interface HeaderProps {
  onRegister: () => void;
  onLogin: () => void;
}

const Branding = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

function Header({ onLogin, onRegister }: HeaderProps) {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        sx={(theme) => ({
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 2,
          justifyContent: 'space-between',
          backgroundColor:
            theme.palette.mode === 'light'
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'light'
              ? alpha(theme.palette.common.black, 0.06)
              : alpha(theme.palette.common.white, 0.08)
            }`,
        })}
      >
        <Branding>
          <img src={logo} alt="Web ChatAI" width={36} height={36} />
          <Typography variant="h4" fontWeight={600} component="div">
            Web ChatAI
          </Typography>
        </Branding>
        <Stack direction="row" spacing={1.5}>
          <Button color="primary" variant="outlined" size="medium" onClick={onRegister}>
            Зарегистрироваться
          </Button>
          <Button color="primary" variant="contained" size="medium" onClick={onLogin}>
            Войти
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;