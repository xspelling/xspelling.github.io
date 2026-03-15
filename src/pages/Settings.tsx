import { Box, Container, Typography, Card, TextField, Button, Grid, Avatar, Chip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { userStore } from '../stores';
import { LEAGUES } from '../types';

const Settings = observer(() => {
  const user = userStore;
  const [username, setUsername] = useState(user.user.username);

  const handleSave = () => {
    user.setUsername(username);
    alert('Username updated!');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>⚙️ Settings</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#f8fafc' }}>Profile</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, backgroundColor: '#6366f1', fontSize: 40 }}>
                  {user.user.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ color: '#f8fafc' }}>{user.user.username}</Typography>
                  <Chip label={`Level ${user.user.level}`} size="small" sx={{ backgroundColor: '#6366f120', color: '#6366f1' }} />
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#0f172a' } }}
              />
              
              <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#6366f1' }}>
                Save Changes
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#f8fafc' }}>Account Stats</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0f172a', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#6366f1' }}>{user.user.level}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Level</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0f172a', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: user.getLeagueColor() }}>{user.user.league}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>League</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0f172a', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#22c55e' }}>${user.user.cash.toLocaleString()}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Cash</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0f172a', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#f59e0b' }}>{user.user.xp.toLocaleString()}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Total XP</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>League Progress</Typography>
              {LEAGUES.map((league, index) => {
                const isUnlocked = index <= LEAGUES.findIndex(l => l.name === user.user.league);
                return (
                  <Box key={league.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: isUnlocked ? league.color : '#334155' }} />
                    <Typography sx={{ color: isUnlocked ? '#f8fafc' : '#64748b', flex: 1 }}>{league.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{league.minXP.toLocaleString()} XP</Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default Settings;
