import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, IconButton, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import GarageIcon from '@mui/icons-material/Garage';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import FlagIcon from '@mui/icons-material/Flag';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DiamondIcon from '@mui/icons-material/Diamond';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { userStore } from '../stores';

const navItems = [
  { label: 'Race', path: '/', icon: <SportsScoreIcon /> },
  { label: 'Garage', path: '/garage', icon: <GarageIcon /> },
  { label: 'Friends', path: '/friends', icon: <GroupsIcon /> },
  { label: 'Leagues', path: '/leagues', icon: <FlagIcon /> },
  { label: 'News', path: '/news', icon: <FlagIcon /> },
  { label: 'VIP', path: '/vip', icon: <DiamondIcon /> },
];

const Header = observer(() => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = userStore;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    user.logout();
    handleMenuClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '56px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#6366f1', 
                fontWeight: 700,
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              TypeRush
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: location.pathname === item.path ? '#6366f1' : '#94a3b8',
                fontSize: '13px',
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#f8fafc',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            icon={<span>💰</span>}
            label={user.user.cash.toLocaleString()}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.2)', 
              color: '#22c55e',
              fontWeight: 600,
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          />
          
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, ml: 1 }}>
            <Typography sx={{ fontSize: 20, mr: 0.5 }}>{user.user.avatar}</Typography>
            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500, mr: 0.5 }}>
              {user.user.username}
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: 12 }}>▼</Typography>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                mt: 1,
              }
            }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
              <SettingsIcon sx={{ mr: 1, fontSize: 18 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 18 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
