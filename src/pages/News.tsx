import { Box, Container, Typography, Grid, Card, Chip } from '@mui/material';
import { news } from '../data';

const News = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>📰 Latest News</Typography>

        <Grid container spacing={3}>
          {news.map(item => (
            <Grid item xs={12} key={item.id}>
              <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip 
                    label={item.type} 
                    size="small"
                    sx={{ 
                      backgroundColor: item.type === 'season' ? '#22c55e20' : item.type === 'update' ? '#6366f120' : '#f59e0b20',
                      color: item.type === 'season' ? '#22c55e' : item.type === 'update' ? '#6366f1' : '#f59e0b',
                      textTransform: 'capitalize',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{item.date}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>{item.title}</Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8' }}>{item.content}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default News;
