import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../stores';
import { cars } from '../data';
import { RARITY_COLORS } from '../types';

const Garage = observer(() => {
  const user = userStore;
  const navigate = useNavigate();
  const ownedCars = cars.filter(car => user.isCarOwned(car.id));
  const selectedCar = cars.find(c => c.id === user.user.selectedCar);

  const totalValue = ownedCars.reduce((sum, car) => sum + car.price, 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>
          🔧 Your Garage
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b', textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontSize: 60, mb: 1 }}>{selectedCar?.emoji || '🚗'}</Typography>
              <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>{selectedCar?.name || 'None'}</Typography>
              <Chip 
                label={selectedCar?.rarity || 'common'} 
                size="small"
                sx={{ backgroundColor: `${RARITY_COLORS[selectedCar?.rarity || 'common']}20`, color: RARITY_COLORS[selectedCar?.rarity || 'common'] }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ p: 3, backgroundColor: '#1e293b', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#6366f1' }}>{ownedCars.length}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Cars Owned</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 3, backgroundColor: '#1e293b', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#22c55e' }}>${totalValue.toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Value</Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Speed</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {[...Array(10)].map((_, i) => (
                      <Box key={i} sx={{ flex: 1, height: 8, borderRadius: 1, backgroundColor: i < (selectedCar?.speed || 5) ? '#6366f1' : '#334155' }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Acceleration</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[...Array(10)].map((_, i) => (
                      <Box key={i} sx={{ flex: 1, height: 8, borderRadius: 1, backgroundColor: i < (selectedCar?.acceleration || 5) ? '#f59e0b' : '#334155' }} />
                    ))}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>Your Cars</Typography>
        <Grid container spacing={2}>
          {ownedCars.map(car => (
            <Grid item xs={6} sm={4} md={3} key={car.id}>
              <Card 
                onClick={() => user.selectCar(car.id)}
                sx={{ 
                  p: 2, 
                  backgroundColor: user.user.selectedCar === car.id ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                  border: user.user.selectedCar === car.id ? '2px solid #6366f1' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <Typography sx={{ fontSize: 40, textAlign: 'center', mb: 1 }}>{car.emoji}</Typography>
                <Typography variant="body2" sx={{ color: '#f8fafc', textAlign: 'center', fontWeight: 600 }}>{car.name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <Chip label={car.speed} size="small" sx={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8', height: 20, fontSize: 10 }} />
                  <Chip label={car.acceleration} size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24', height: 20, fontSize: 10 }} />
                </Box>
                {user.user.selectedCar === car.id && (
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#6366f1', mt: 1 }}>SELECTED</Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/shop')} sx={{ backgroundColor: '#6366f1' }}>
            🛒 Visit Shop
          </Button>
        </Box>
      </Container>
    </Box>
  );
});

export default Garage;
