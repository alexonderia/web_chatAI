import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
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
      <Toolbar sx={{ width: '100%', mx: 'auto', bgcolor:'white', justifyContent: 'space-between' }}>
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