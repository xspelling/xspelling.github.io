import { AppBar, Toolbar, Typography, Box, Button, Container, Avatar, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HomeIcon from '@mui/icons-material/Home';
import { observer } from 'mobx-react-lite';
import { articleStore } from '../stores';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'News', path: '/news', icon: <NewspaperIcon /> },
  { label: 'Premium', path: '/premium', icon: <WorkspacePremiumIcon />, premium: true },
];

function Header() {
  const location = useLocation();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.08)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0, minHeight: '56px !important' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AutoStoriesIcon sx={{ color: '#0071e3', fontSize: 32 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#1d1d1f', 
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              LitPro
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: location.pathname === item.path ? '#0071e3' : '#1d1d1f',
                  fontSize: '15px',
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  borderRadius: 10,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: '#1d1d1f',
                  },
                }}
              >
                {item.label}
                {item.premium && (
                  <Chip 
                    label="PRO" 
                    size="small" 
                    sx={{ ml: 1, height: 20, fontSize: 10, fontWeight: 700, background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', color: '#000' }} 
                  />
                )}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {articleStore.isPremiumUser && (
              <Chip 
                icon={<WorkspacePremiumIcon sx={{ fontSize: 16 }} />}
                label="Premium" 
                size="small"
                sx={{ background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', color: '#000', fontWeight: 600 }}
              />
            )}
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#0071e3', fontSize: 14 }}>
              U
            </Avatar>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default observer(Header);
