import { Box, Container, Typography, Grid, Card, LinearProgress, Chip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores';
import { LEAGUES } from '../types';

const Leagues = observer(() => {
  const user = userStore;
  const currentLeagueIndex = LEAGUES.findIndex(l => l.name === user.user.league);
  const nextLeague = LEAGUES[currentLeagueIndex + 1];
  const progressToNext = nextLeague 
    ? ((user.user.xp - LEAGUES[currentLeagueIndex].minXP) / (nextLeague.minXP - LEAGUES[currentLeagueIndex].minXP)) * 100
    : 100;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>🏆 Leagues</Typography>

        <Card sx={{ p: 3, mb: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h5" sx={{ mb: 2, color: user.getLeagueColor() }}>
            {user.user.league} League
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 2 }}>
            XP: {user.user.xp.toLocaleString()}
          </Typography>
          {nextLeague && (
            <>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                Progress to {nextLeague.name}: {nextLeague.minXP - user.user.xp} XP needed
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressToNext}
                sx={{ height: 10, borderRadius: 5, backgroundColor: '#334155', '& .MuiLinearProgress-bar': { backgroundColor: nextLeague.color } }}
              />
            </>
          )}
        </Card>

        <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>All Leagues</Typography>
        <Grid container spacing={2}>
          {LEAGUES.map((league, index) => {
            const isCurrent = user.user.league === league.name;
            const isUnlocked = index <= currentLeagueIndex;
            
            return (
              <Grid item xs={12} sm={6} key={league.name}>
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: isCurrent ? `${league.color}20` : '#1e293b',
                  border: isCurrent ? `2px solid ${league.color}` : '2px solid transparent',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h4" sx={{ color: league.color }}>
                        {index === 0 ? '🥉' : index === 1 ? '🥈' : index === 2 ? '🥇' : '⭐'}
                      </Typography>
                      <Box>
                        <Typography variant="h6" sx={{ color: isUnlocked ? '#f8fafc' : '#64748b' }}>{league.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{league.minXP.toLocaleString()} XP+</Typography>
                      </Box>
                    </Box>
                    {isCurrent && <Chip label="CURRENT" size="small" sx={{ backgroundColor: league.color, color: '#000' }} />}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

export default Leagues;
