import { Box, Container, Typography, Grid, Card, Button, Chip, TextField, MenuItem, InputAdornment } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SearchIcon from '@mui/icons-material/Search';
import { userStore } from '../stores';
import { cars } from '../data';
import { RARITY_COLORS } from '../types';
import { useState } from 'react';

const Shop = observer(() => {
  const user = userStore;
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('all');

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = rarity === 'all' || car.rarity === rarity;
    return matchesSearch && matchesRarity;
  });

  const handleBuy = (carId: string) => {
    const success = user.buyCar(carId);
    if (!success) {
      alert('Not enough cash or already owned!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ color: '#f8fafc' }}>🛒 Car Shop</Typography>
          <Chip 
            icon={<span>💰</span>}
            label={`${user.user.cash.toLocaleString()} Cash`}
            sx={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontWeight: 600, py: 2, px: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, maxWidth: 300, '& .MuiOutlinedInput-root': { backgroundColor: '#1e293b' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>,
            }}
          />
          <TextField
            select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            size="small"
            sx={{ width: 150, '& .MuiOutlinedInput-root': { backgroundColor: '#1e293b' } }}
          >
            <MenuItem value="all">All Rarities</MenuItem>
            <MenuItem value="common">Common</MenuItem>
            <MenuItem value="rare">Rare</MenuItem>
            <MenuItem value="epic">Epic</MenuItem>
            <MenuItem value="legendary">Legendary</MenuItem>
          </TextField>
        </Box>

        <Grid container spacing={2}>
          {filteredCars.map(car => {
            const isOwned = user.isCarOwned(car.id);
            const canAfford = user.user.cash >= car.price;

            return (
              <Grid item xs={6} sm={4} md={3} key={car.id}>
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: '#1e293b',
                  opacity: !isOwned && !canAfford ? 0.6 : 1,
                }}>
                  <Box sx={{ position: 'relative', mb: 1 }}>
                    <Typography sx={{ fontSize: 50, textAlign: 'center' }}>{car.emoji}</Typography>
                    {car.season && (
                      <Chip label={car.season} size="small" sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#f59e0b20', color: '#f59e0b', fontSize: 10 }} />
                    )}
                    <Chip 
                      label={car.rarity} 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        backgroundColor: `${RARITY_COLORS[car.rarity]}20`, 
                        color: RARITY_COLORS[car.rarity],
                        fontSize: 10,
                        textTransform: 'capitalize',
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: '#f8fafc', textAlign: 'center', fontWeight: 600, mb: 1 }}>{car.name}</Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip label={`⚡ ${car.speed}`} size="small" sx={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8', height: 22 }} />
                    <Chip label={`🏎️ ${car.acceleration}`} size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24', height: 22 }} />
                  </Box>

                  {isOwned ? (
                    <Button fullWidth variant="outlined" disabled sx={{ borderColor: '#22c55e', color: '#22c55e' }}>
                      Owned ✓
                    </Button>
                  ) : (
                    <Button 
                      fullWidth 
                      variant="contained"
                      onClick={() => handleBuy(car.id)}
                      disabled={!canAfford}
                      sx={{ 
                        backgroundColor: canAfford ? '#22c55e' : '#374151',
                        '&:hover': { backgroundColor: canAfford ? '#16a34a' : '#374151' }
                      }}
                    >
                      💰 ${car.price.toLocaleString()}
                    </Button>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
});

export default Shop;
