import { Box, Container, Typography, Button, Card, CardContent, Grid, Chip, LinearProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { userStore, raceStore } from '../stores';
import { cars } from '../data';

const Home = observer(() => {
  const navigate = useNavigate();
  const user = userStore;
  const race = raceStore;
  const selectedCar = cars.find(c => c.id === user.user.selectedCar);

  const handleStartRace = () => {
    race.startCountdown();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: user.season.background,
      pt: 8,
      pb: 4,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(15,23,42,0.8) 100%)',
        pointerEvents: 'none',
      }} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {race.isCountdown && (
          <Box sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            zIndex: 1000,
          }}>
            <Typography variant="h1" sx={{ 
              fontSize: '200px', 
              fontWeight: 700,
              color: '#6366f1',
              animation: 'pulse 1s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              }
            }}>
              {race.countdown}
            </Typography>
          </Box>
        )}

        {race.isRacing && (
          <Box sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0f172a',
            zIndex: 999,
            pt: 8,
          }}>
            <Container maxWidth="md">
              <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#f8fafc' }}>
                🏁 Race in Progress
              </Typography>

              <Box sx={{ mb: 4 }}>
                {race.opponents.map((opp) => (
                  <Box key={opp.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ color: '#f8fafc', fontWeight: 500 }}>
                        {opp.avatar} {opp.name}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8' }}>{opp.wpm} WPM</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={opp.progress}
                      sx={{ 
                        height: 20, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: '#6366f1',
                          borderRadius: 1,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box sx={{ 
                p: 3, 
                backgroundColor: '#1e293b', 
                borderRadius: 2,
                mb: 4,
              }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  Your Progress: {race.wpm} WPM | {race.accuracy}% Accuracy
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={race.progress}
                  sx={{ 
                    height: 24, 
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': { 
                      backgroundColor: '#22c55e',
                      borderRadius: 1,
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#f8fafc', mt: 1 }}>
                  {race.text.slice(0, race.currentIndex)}
                  <span style={{ color: '#6366f1' }}>{race.text[race.currentIndex]}</span>
                  {race.text.slice(race.currentIndex + 1)}
                </Typography>
              </Box>
            </Container>
          </Box>
        )}

        {race.raceResult && race.finished && (
          <Box sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            zIndex: 1001,
          }}>
            <Card sx={{ maxWidth: 500, p: 4, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {race.raceResult.place === 1 ? '🏆' : race.raceResult.place === 2 ? '🥈' : race.raceResult.place === 3 ? '🥉' : '🏁'}
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, color: race.raceResult.place === 1 ? '#fbbf24' : '#f8fafc' }}>
                {race.raceResult.place === 1 ? 'Victory!' : `Place #${race.raceResult.place}`}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ color: '#6366f1' }}>{race.raceResult.wpm}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>WPM</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ color: '#22c55e' }}>{race.raceResult.accuracy}%</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Accuracy</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ color: '#f59e0b' }}>+{race.raceResult.xpEarned}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>XP</Typography>
                </Grid>
              </Grid>

              <Chip 
                icon={<span>💰</span>}
                label={`+${race.raceResult.cashEarned} Cash`}
                sx={{ mb: 3, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => race.startCountdown()} sx={{ backgroundColor: '#6366f1' }}>
                  Race Again
                </Button>
                <Button variant="outlined" onClick={() => race.reset()} sx={{ borderColor: '#6366f1', color: '#6366f1' }}>
                  Back
                </Button>
              </Box>
            </Card>
          </Box>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h4" sx={{ mb: 3, color: '#f8fafc' }}>
                🏎️ Ready to Race
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography sx={{ fontSize: 60 }}>{selectedCar?.emoji || '🚗'}</Typography>
                <Box>
                  <Typography variant="h6" sx={{ color: '#f8fafc' }}>{selectedCar?.name || 'Sedan'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip size="small" label={`Speed: ${selectedCar?.speed || 5}`} sx={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
                    <Chip size="small" label={`Accel: ${selectedCar?.acceleration || 5}`} sx={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }} />
                  </Box>
                </Box>
              </Box>

              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleStartRace}
                disabled={race.isRacing || race.isCountdown}
                startIcon={<SportsScoreIcon />}
                sx={{ 
                  backgroundColor: '#6366f1',
                  py: 2,
                  fontSize: '18px',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#4f46e5' },
                  '&:disabled': { backgroundColor: '#374151' }
                }}
              >
                START RACE
              </Button>
            </Card>

            <Card sx={{ p: 3, mt: 3, backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#f8fafc' }}>
                🎯 Quick Practice
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                Practice typing without racing to improve your skills
              </Typography>
              <Button 
                fullWidth 
                variant="outlined"
                onClick={() => navigate('/practice')}
                startIcon={<TrackChangesIcon />}
                sx={{ borderColor: '#6366f1', color: '#6366f1' }}
              >
                Practice Mode
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>
                📊 Your Stats
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#6366f1' }}>{user.user.level}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Level</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: user.getLeagueColor() }}>{user.user.league}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>League</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#22c55e' }}>{user.user.xp.toLocaleString()}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Total XP</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#8b5cf6' }}>{user.user.friends.length}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Friends</Typography>
                  </Box>
                </Grid>
              </Grid>

              {user.user.isPremium && (
                <Box sx={{ mt: 2, p: 2, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', borderRadius: 2, textAlign: 'center' }}>
                  <Typography sx={{ color: '#000', fontWeight: 600 }}>⭐ VIP Member Active</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.7)' }}>2x Cash & XP Bonus</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default Home;
