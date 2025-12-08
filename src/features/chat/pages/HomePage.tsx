import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from '@/features/chat/components/Header';
import HeroSection from '@/features/chat/components/HeroSection';
import AuthDialog from '@/features/auth/AuthDialog';
import { useSimpleRouter } from '@/app/router/SimpleRouter';

type AuthMode = 'login' | 'register';

function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { navigate } = useSimpleRouter();

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleCloseAuth = () => setAuthOpen(false);
  const handleAuthComplete = () => {
    setAuthOpen(false);
    navigate('/client/newChat');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onLogin={() => handleOpenAuth('login')}
        onRegister={() => handleOpenAuth('register')}
      />
      <Container
        component="main"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <HeroSection />
      </Container>

      <AuthDialog
        open={authOpen}
        mode={authMode}
        onClose={handleCloseAuth}
        onAction={handleAuthComplete}
      />
    </Box>
  );
}

export default HomePage;