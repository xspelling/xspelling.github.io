import { Box, Container, Typography, Button, Grid, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ArticleIcon from '@mui/icons-material/Article';
import SpeedIcon from '@mui/icons-material/Speed';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import GroupsIcon from '@mui/icons-material/Groups';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
      title: 'Finger Guidance',
      description: 'Learn which finger to use for each key with real-time visual feedback',
      path: '/practice',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your WPM and accuracy with detailed performance metrics',
      path: '/practice',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: 'Race with Friends',
      description: 'Create a room and race against friends in real-time typing competitions',
      path: '/race',
    },
    {
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      title: 'Article Library',
      description: 'Practice typing with articles from various categories and difficulty levels',
      path: '/news',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 16, pb: 8, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              color: '#1d1d1f',
              mb: 3,
            }}
          >
            Master Typing
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: '#86868b', mb: 6, fontWeight: 400 }}
          >
            Learn proper finger placement • Race friends • Track progress
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/practice')}
              sx={{
                background: '#0071e3',
                fontSize: '18px',
                px: 4,
                py: 1.5,
                '&:hover': { background: '#0077ed', transform: 'scale(1.02)' },
                transition: 'all 0.2s',
              }}
            >
              Start Practicing
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/race')}
              sx={{
                borderColor: '#d2d2d7',
                color: '#1d1d1f',
                fontSize: '18px',
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: '#1d1d1f', backgroundColor: 'rgba(0,0,0,0.02)' },
              }}
            >
              Race Mode
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={() => navigate(feature.path)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: '#0071e3', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, color: '#1d1d1f' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#86868b' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 4, color: '#1d1d1f' }}>
            Ready to improve?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Card
              onClick={() => navigate('/practice')}
              sx={{
                cursor: 'pointer',
                width: 280,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <KeyboardIcon sx={{ fontSize: 60, color: '#0071e3', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1 }}>Solo Practice</Typography>
                <Typography variant="body2" sx={{ color: '#86868b' }}>
                  Practice at your own pace
                </Typography>
              </Box>
            </Card>
            <Card
              onClick={() => navigate('/race')}
              sx={{
                cursor: 'pointer',
                width: 280,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <SportsScoreIcon sx={{ fontSize: 60, color: '#ff6b6b', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1 }}>Race Mode</Typography>
                <Typography variant="body2" sx={{ color: '#86868b' }}>
                  Compete with friends
                </Typography>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
