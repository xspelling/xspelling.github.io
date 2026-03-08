import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Practice', path: '/practice', icon: <KeyboardIcon /> },
  { label: 'Race', path: '/race', icon: <SportsScoreIcon /> },
  { label: 'News', path: '/news', icon: <ArticleIcon /> },
];

function Header() {
  const location = useLocation();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0, minHeight: '48px !important' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyboardIcon sx={{ color: '#0071e3', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1d1d1f', 
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              XSpelling
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: location.pathname === item.path ? '#0071e3' : '#1d1d1f',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 8,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    color: '#1d1d1f',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
