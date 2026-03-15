import { Box, Container, Typography, Grid, Card, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { userStore } from '../stores';

const VIP = observer(() => {
  const user = userStore;
  const navigate = useNavigate();

  const handleSubscribe = () => {
    user.subscribePremium();
    alert('Welcome to VIP Club! You now have 2x Cash and XP boost!');
  };

  if (user.user.isPremium) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
            borderRadius: 4, 
            p: 6,
            mb: 4,
          }}>
            <Typography variant="h2" sx={{ color: '#000', mb: 1 }}>⭐ You're a VIP!</Typography>
            <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)' }}>Thank you for being a VIP member</Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 3, color: '#f8fafc' }}>Your VIP Benefits</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 2, backgroundColor: '#1e293b' }}>
                <Typography variant="h3" sx={{ color: '#22c55e' }}>2x</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Cash Earned</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 2, backgroundColor: '#1e293b' }}>
                <Typography variant="h3" sx={{ color: '#6366f1' }}>2x</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>XP Gained</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 2, backgroundColor: '#1e293b' }}>
                <Typography variant="h3" sx={{ color: '#f59e0b' }}>🚫</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>No Ads</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ p: 2, backgroundColor: '#1e293b' }}>
                <Typography variant="h3" sx={{ color: '#8b5cf6' }}>🏎️</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>VIP Cars</Typography>
              </Card>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 4, backgroundColor: '#f59e0b', color: '#000' }}>
            Start Racing
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2, color: '#f59e0b' }}>⭐ VIP Club</Typography>
        <Typography variant="h5" sx={{ mb: 4, color: '#94a3b8' }}>Unlock the full racing experience!</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 4, backgroundColor: '#1e293b', height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#f8fafc' }}>Monthly</Typography>
              <Typography variant="h2" sx={{ mb: 1, color: '#f8fafc' }}>$4.99<span style={{ fontSize: 16 }}>/mo</span></Typography>
              <List>
                <ListItem sx={{ color: '#94a3b8' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="2x Cash" />
                </ListItem>
                <ListItem sx={{ color: '#94a3b8' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="2x XP" />
                </ListItem>
                <ListItem sx={{ color: '#94a3b8' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="Ad-free" />
                </ListItem>
                <ListItem sx={{ color: '#94a3b8' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="VIP exclusive cars" />
                </ListItem>
              </List>
              <Button fullWidth variant="contained" onClick={handleSubscribe} sx={{ backgroundColor: '#6366f1', mt: 2 }}>
                Subscribe
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 4, backgroundColor: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', border: '2px solid #f59e0b', height: '100%' }}>
              <Chip label="BEST VALUE" size="small" sx={{ backgroundColor: '#fff', color: '#f59e0b', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 1, color: '#f8fafc' }}>Yearly</Typography>
              <Typography variant="h2" sx={{ mb: 1, color: '#f8fafc' }}>$39.99<span style={{ fontSize: 16 }}>/yr</span></Typography>
              <Typography variant="body2" sx={{ color: '#22c55e', mb: 2 }}>Save 33%!</Typography>
              <List>
                <ListItem sx={{ color: '#f8fafc' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="2x Cash" />
                </ListItem>
                <ListItem sx={{ color: '#f8fafc' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="2x XP" />
                </ListItem>
                <ListItem sx={{ color: '#f8fafc' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="Ad-free" />
                </ListItem>
                <ListItem sx={{ color: '#f8fafc' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="VIP exclusive cars" />
                </ListItem>
                <ListItem sx={{ color: '#f8fafc' }}>
                  <ListItemIcon><CheckIcon sx={{ color: '#22c55e' }} /></ListItemIcon>
                  <ListItemText primary="Priority support" />
                </ListItem>
              </List>
              <Button fullWidth variant="contained" onClick={handleSubscribe} sx={{ backgroundColor: '#f59e0b', color: '#000', mt: 2 }}>
                Subscribe
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default VIP;
