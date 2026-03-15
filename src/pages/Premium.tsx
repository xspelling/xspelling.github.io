import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import BlockIcon from '@mui/icons-material/Block';
import { articleStore } from '../stores';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      { text: 'Access to free articles', included: true },
      { text: 'Basic reading tools', included: true },
      { text: 'Bookmark articles', included: true },
      { text: 'Premium articles', included: false },
      { text: 'Ad-free experience', included: false },
      { text: 'Offline reading', included: false },
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    description: 'Flexible monthly subscription',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Access to all premium articles', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Offline reading', included: true },
      { text: 'Exclusive content', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Subscribe Monthly',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$79.99',
    period: 'per year',
    description: 'Save 33% with annual billing',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Access to all premium articles', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Offline reading', included: true },
      { text: 'Exclusive content', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Subscribe Yearly',
    highlighted: true,
    savings: 'Save 33%',
  },
];

const Premium = observer(() => {
  const navigate = useNavigate();
  const store = articleStore;

  const handleSubscribe = (planName: string) => {
    if (planName === 'Free') return;
    
    store.subscribePremium();
    alert(`Welcome to ${planName} plan! You now have premium access.`);
    navigate('/news');
  };

  if (store.isPremiumUser) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pt: 8 }}>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', 
            borderRadius: 4, 
            p: 6,
            mb: 4,
          }}>
            <WorkspacePremiumIcon sx={{ fontSize: 80, color: '#fff', mb: 2 }} />
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              You're Premium!
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Thank you for subscribing to LitPro
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 4, color: '#1d1d1f' }}>
            Your Premium Benefits
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>📖 Unlimited Reading</Typography>
                <Typography variant="body2" sx={{ color: '#86868b' }}>
                  Access all articles including premium content
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>🚫 No Ads</Typography>
                <Typography variant="body2" sx={{ color: '#86868b' }}>
                  Enjoy an ad-free reading experience
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>⭐ Exclusive Content</Typography>
                <Typography variant="body2" sx={{ color: '#86868b' }}>
                  Get access to member-only articles
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/news')}
            sx={{ mt: 4, background: '#0071e3', px: 4 }}
          >
            Start Reading
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pt: 8 }}>
      <Box sx={{ background: 'linear-gradient(180deg, #fff 0%, #f5f5f7 100%)', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Chip 
            icon={<StarIcon sx={{ fontSize: 16 }} />}
            label="LITPRO PREMIUM"
            sx={{ 
              background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', 
              color: '#000',
              fontWeight: 700,
              mb: 2,
              px: 1,
            }} 
          />
          <Typography variant="h2" sx={{ mb: 2, color: '#1d1d1f', fontWeight: 700 }}>
            Unlock Your Full Potential
          </Typography>
          <Typography variant="h6" sx={{ color: '#86868b', mb: 4, fontWeight: 400 }}>
            Get unlimited access to all articles, exclusive content, and premium features
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.highlighted ? '2px solid #f5a623' : '1px solid #e5e5ea',
                  transform: plan.highlighted ? 'scale(1.05)' : 'none',
                  zIndex: plan.highlighted ? 1 : 0,
                }}
              >
                {plan.highlighted && (
                  <Chip 
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="MOST POPULAR"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', 
                      color: '#000',
                      fontWeight: 700,
                      fontSize: 11,
                    }} 
                  />
                )}
                
                {plan.savings && (
                  <Chip 
                    label={plan.savings}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      background: '#30d158', 
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 11,
                    }} 
                  />
                )}

                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ mb: 1, color: '#1d1d1f', fontWeight: 600 }}>
                    {plan.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h3" sx={{ color: '#1d1d1f', fontWeight: 700 }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868b', ml: 1 }}>
                      {plan.period}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#86868b', mb: 3 }}>
                    {plan.description}
                  </Typography>

                  <List dense>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {feature.included ? 
                            <CheckIcon sx={{ color: '#30d158', fontSize: 20 }} /> : 
                            <BlockIcon sx={{ color: '#d2d2d7', fontSize: 20 }} />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature.text} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: { color: feature.included ? '#1d1d1f' : '#aeaeb2' }
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant={plan.highlighted ? 'contained' : 'outlined'}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={plan.name === 'Free'}
                    sx={{
                      background: plan.highlighted ? 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)' : 'transparent',
                      color: plan.highlighted ? '#000' : '#1d1d1f',
                      borderColor: plan.highlighted ? 'transparent' : '#d2d2d7',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        background: plan.highlighted ? 'linear-gradient(135deg, #e6991f 0%, #e6c020 100%)' : 'rgba(0,0,0,0.04)',
                        borderColor: plan.highlighted ? 'transparent' : '#1d1d1f',
                      },
                      '&:disabled': {
                        background: '#f5f5f7',
                        color: '#aeaeb2',
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#86868b' }}>
            🔒 Secure payment • Cancel anytime • 30-day money back guarantee
          </Typography>
        </Box>
      </Container>
    </Box>
  );
});

export default Premium;
