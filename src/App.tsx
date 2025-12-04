import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AuthDialog from './components/AuthDialog';

type AuthMode = 'login' | 'register';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleCloseAuth = () => setAuthOpen(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogin={() => handleOpenAuth('login')} onRegister={() => handleOpenAuth('register')} />
      <Container component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroSection />
      </Container>

      <AuthDialog open={authOpen} mode={authMode} onClose={handleCloseAuth} />
    </Box>
  );
}

export default App;