import { useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, LinearProgress, Card, Grid, TextField, MenuItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { typingStore, userStore } from '../stores';
import { defaultTexts } from '../data';

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

const FINGER_MAP: Record<string, { finger: string }> = {
  'q': { finger: 'Left Pinky' }, 'a': { finger: 'Left Pinky' }, 'z': { finger: 'Left Pinky' },
  'w': { finger: 'Left Ring' }, 's': { finger: 'Left Ring' }, 'x': { finger: 'Left Ring' },
  'e': { finger: 'Left Middle' }, 'd': { finger: 'Left Middle' }, 'c': { finger: 'Left Middle' },
  'r': { finger: 'Left Index' }, 'f': { finger: 'Left Index' }, 'v': { finger: 'Left Index' },
  't': { finger: 'Left Index' }, 'g': { finger: 'Left Index' }, 'b': { finger: 'Left Index' },
  'y': { finger: 'Right Index' }, 'h': { finger: 'Right Index' }, 'n': { finger: 'Right Index' },
  'u': { finger: 'Right Index' }, 'j': { finger: 'Right Index' }, 'm': { finger: 'Right Index' },
  'i': { finger: 'Right Middle' }, 'k': { finger: 'Right Middle' }, ',': { finger: 'Right Middle' },
  'o': { finger: 'Right Ring' }, 'l': { finger: 'Right Ring' }, '.': { finger: 'Right Ring' },
  'p': { finger: 'Right Pinky' }, ';': { finger: 'Right Pinky' }, ' ': { finger: 'Thumb' },
};

const FINGER_COLORS: Record<string, string> = {
  'Left Pinky': '#ff6b6b', 'Left Ring': '#feca57', 'Left Middle': '#48dbfb',
  'Left Index': '#1dd1a1', 'Right Index': '#1dd1a1', 'Right Middle': '#48dbfb',
  'Right Ring': '#feca57', 'Right Pinky': '#ff6b6b', 'Thumb': '#a29bfe',
};

const Practice = observer(() => {
  const store = typingStore;
  const user = userStore;

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (store.isComplete) return;
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      store.handleKeyPress(e.key);
      if (store.isComplete) {
        user.addXP(Math.floor(store.wpm / 2));
        user.addCash(Math.floor(store.wpm / 4));
      }
    }
  }, [store, user]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const targetKey = store.currentChar.toLowerCase();
  const fingerInfo = FINGER_MAP[targetKey] || { finger: 'Unknown' };
  const fingerColor = FINGER_COLORS[fingerInfo.finger] || '#444';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>
          🎯 Practice Mode
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, mb: 3, backgroundColor: '#1e293b' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#f8fafc' }}>Text to Type</Typography>
                <Button size="small" onClick={() => store.setText(defaultTexts[Math.floor(Math.random() * defaultTexts.length)])} sx={{ color: '#6366f1' }}>
                  New Text
                </Button>
              </Box>
              
              <Box sx={{ fontSize: '20px', lineHeight: 1.8, color: '#64748b', mb: 2 }}>
                {store.text.split('').map((char, index) => {
                  let color = '#64748b';
                  if (index < store.currentIndex) color = '#22c55e';
                  else if (index === store.currentIndex) color = '#6366f1';
                  return (
                    <span key={index} style={{ color, backgroundColor: index === store.currentIndex ? 'rgba(99,102,241,0.2)' : 'transparent' }}>
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
                  backgroundColor: '#334155',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#6366f1' }
                }} 
              />
            </Card>

            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: fingerColor, mb: 1 }}>
                  👆 Use: {fingerInfo.finger}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <Box
                    key={rowIndex}
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      ml: rowIndex === 1 ? 3 : rowIndex === 2 ? 5 : rowIndex === 3 ? 7 : 0,
                    }}
                  >
                    {row.map((key) => {
                      const isTarget = key === targetKey;
                      const keyFinger = FINGER_MAP[key]?.finger || 'Unknown';
                      const keyColor = FINGER_COLORS[keyFinger] || '#334155';

                      return (
                        <Box
                          key={key}
                          sx={{
                            width: key === ' ' ? 180 : 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            backgroundColor: isTarget ? keyColor : '#0f172a',
                            border: isTarget ? `2px solid ${keyColor}` : '1px solid #334155',
                            boxShadow: isTarget ? `0 0 15px ${keyColor}50` : 'none',
                            transition: 'all 0.1s ease',
                            transform: isTarget ? 'scale(1.1)' : 'scale(1)',
                          }}
                        >
                          <Typography sx={{ color: isTarget ? '#fff' : '#94a3b8', fontSize: key === ' ' ? 10 : 14 }}>
                            {key === ' ' ? 'SPACE' : key}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#f8fafc' }}>Statistics</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>WPM</Typography>
                <Typography variant="h3" sx={{ color: '#6366f1' }}>{store.wpm}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Accuracy</Typography>
                <Typography variant="h3" sx={{ color: store.accuracy >= 90 ? '#22c55e' : store.accuracy >= 70 ? '#f59e0b' : '#ef4444' }}>
                  {store.accuracy}%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Progress</Typography>
                <Typography variant="h5" sx={{ color: '#f8fafc' }}>
                  {store.currentIndex} / {store.text.length}
                </Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#f8fafc' }}>Quick Texts</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {defaultTexts.slice(0, 4).map((text, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => store.setText(text)}
                    sx={{ borderColor: '#475569', color: '#94a3b8', fontSize: 10 }}
                  >
                    {text.slice(0, 20)}...
                  </Button>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {store.isComplete && (
          <Card sx={{ p: 4, textAlign: 'center', mt: 3, backgroundColor: '#1e293b' }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#22c55e' }}>Completed! 🎉</Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="h3" sx={{ color: '#6366f1' }}>{store.wpm}</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Words Per Minute</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h3" sx={{ color: '#22c55e' }}>{store.accuracy}%</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Accuracy</Typography>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={() => store.reset()} sx={{ mt: 3, backgroundColor: '#6366f1' }}>
              Try Again
            </Button>
          </Card>
        )}
      </Container>
    </Box>
  );
});

export default Practice;
