import { useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, LinearProgress, Card, Grid, TextField, MenuItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { typingStore, articleStore } from '../stores';
import { defaultTexts } from '../data/articles';
import Keyboard from '../components/Keyboard';

const Practice = observer(() => {
  const store = typingStore;

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (store.isComplete) return;
    
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      store.handleKeyPress(e.key);
    }
  }, [store]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleTextChange = (text: string) => {
    store.setText(text);
  };

  const handleReset = () => {
    store.reset();
  };

  const selectArticle = (articleId: string) => {
    const article = articleStore.articles.find(a => a.id === articleId);
    if (article) {
      store.setText(article.content);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ mb: 2, color: '#1d1d1f' }}>
            Practice Mode
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b' }}>
            Type the text below. Use the keyboard visualization to guide your fingers.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1d1d1f' }}>Text to Type</Typography>
                <Button size="small" onClick={handleReset} sx={{ color: '#0071e3' }}>
                  Reset
                </Button>
              </Box>
              
              <Box sx={{ fontSize: '20px', lineHeight: 1.8, color: '#86868b', mb: 2 }}>
                {store.text.split('').map((char, index) => {
                  let color = '#86868b';
                  if (index < store.currentIndex) {
                    color = '#30d158';
                  } else if (index === store.currentIndex) {
                    color = '#0071e3';
                  }
                  return (
                    <span key={index} style={{ color, backgroundColor: index === store.currentIndex ? 'rgba(0,113,227,0.1)' : 'transparent' }}>
                      {char}
                    </span>
                  );
                })}
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={store.progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: '#e5e5ea',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#0071e3' }
                }} 
              />
            </Card>

            <Keyboard />

            <Card sx={{ mt: 3, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>Quick Texts</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {defaultTexts.map((text, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => handleTextChange(text)}
                    sx={{ borderColor: '#d2d2d7', color: '#1d1d1f', fontSize: 12 }}
                  >
                    {text.slice(0, 30)}...
                  </Button>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>Statistics</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#86868b' }}>WPM</Typography>
                <Typography variant="h3" sx={{ color: '#0071e3' }}>{store.wpm}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#86868b' }}>Accuracy</Typography>
                <Typography variant="h3" sx={{ color: store.accuracy >= 90 ? '#30d158' : store.accuracy >= 70 ? '#ffd60a' : '#ff453a' }}>
                  {store.accuracy}%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: '#86868b' }}>Progress</Typography>
                <Typography variant="h5" sx={{ color: '#1d1d1f' }}>
                  {store.currentIndex} / {store.text.length}
                </Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1d1d1f' }}>Select Article</Typography>
              <TextField
                select
                fullWidth
                label="Choose an article"
                value=""
                onChange={(e) => selectArticle(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#d2d2d7' },
                    '&:hover fieldset': { borderColor: '#0071e3' },
                  },
                }}
              >
                <MenuItem value="">Select article...</MenuItem>
                {articleStore.articles.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    {article.title}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                {articleStore.articles.slice(0, 5).map((article) => (
                  <Box
                    key={article.id}
                    onClick={() => selectArticle(article.id)}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      backgroundColor: '#f5f5f7',
                      '&:hover': { backgroundColor: '#e5e5ea' },
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#1d1d1f', fontWeight: 500 }}>
                      {article.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#86868b' }}>
                      {article.category} • {article.difficulty}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {store.isComplete && (
          <Card sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#30d158' }}>Completed!</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h3" sx={{ color: '#0071e3' }}>{store.wpm}</Typography>
                <Typography variant="body1" sx={{ color: '#86868b' }}>Words Per Minute</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h3" sx={{ color: '#30d158' }}>{store.accuracy}%</Typography>
                <Typography variant="body1" sx={{ color: '#86868b' }}>Accuracy</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h3" sx={{ color: '#ffd60a' }}>{store.errors}</Typography>
                <Typography variant="body1" sx={{ color: '#86868b' }}>Errors</Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              size="large"
              onClick={handleReset}
              sx={{ mt: 3, background: '#0071e3' }}
            >
              Try Again
            </Button>
          </Card>
        )}
      </Container>
    </Box>
  );
});

export default Practice;
