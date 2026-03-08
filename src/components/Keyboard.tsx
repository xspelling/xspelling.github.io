import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { typingStore } from '../stores';

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

const FINGER_MAP: Record<string, { row: number; finger: string }> = {
  '`': { row: 0, finger: 'Left Pinky' },
  '1': { row: 0, finger: 'Left Pinky' },
  '2': { row: 0, finger: 'Left Ring' },
  '3': { row: 0, finger: 'Left Middle' },
  '4': { row: 0, finger: 'Left Index' },
  '5': { row: 0, finger: 'Left Index' },
  '6': { row: 0, finger: 'Right Index' },
  '7': { row: 0, finger: 'Right Index' },
  '8': { row: 0, finger: 'Right Middle' },
  '9': { row: 0, finger: 'Right Ring' },
  '0': { row: 0, finger: 'Right Pinky' },
  '-': { row: 0, finger: 'Right Pinky' },
  '=': { row: 0, finger: 'Right Pinky' },
  'q': { row: 1, finger: 'Left Pinky' },
  'w': { row: 1, finger: 'Left Ring' },
  'e': { row: 1, finger: 'Left Middle' },
  'r': { row: 1, finger: 'Left Index' },
  't': { row: 1, finger: 'Left Index' },
  'y': { row: 1, finger: 'Right Index' },
  'u': { row: 1, finger: 'Right Index' },
  'i': { row: 1, finger: 'Right Middle' },
  'o': { row: 1, finger: 'Right Ring' },
  'p': { row: 1, finger: 'Right Pinky' },
  '[': { row: 1, finger: 'Right Pinky' },
  ']': { row: 1, finger: 'Right Pinky' },
  '\\': { row: 1, finger: 'Right Pinky' },
  'a': { row: 2, finger: 'Left Pinky' },
  's': { row: 2, finger: 'Left Ring' },
  'd': { row: 2, finger: 'Left Middle' },
  'f': { row: 2, finger: 'Left Index' },
  'g': { row: 2, finger: 'Left Index' },
  'h': { row: 2, finger: 'Right Index' },
  'j': { row: 2, finger: 'Right Index' },
  'k': { row: 2, finger: 'Right Middle' },
  'l': { row: 2, finger: 'Right Ring' },
  ';': { row: 2, finger: 'Right Pinky' },
  "'": { row: 2, finger: 'Right Pinky' },
  'z': { row: 3, finger: 'Left Pinky' },
  'x': { row: 3, finger: 'Left Ring' },
  'c': { row: 3, finger: 'Left Middle' },
  'v': { row: 3, finger: 'Left Index' },
  'b': { row: 3, finger: 'Left Index' },
  'n': { row: 3, finger: 'Right Index' },
  'm': { row: 3, finger: 'Right Index' },
  ',': { row: 3, finger: 'Right Middle' },
  '.': { row: 3, finger: 'Right Ring' },
  '/': { row: 3, finger: 'Right Pinky' },
  ' ': { row: 4, finger: 'Thumb' },
};

const FINGER_COLORS: Record<string, string> = {
  'Left Pinky': '#ff6b6b',
  'Left Ring': '#feca57',
  'Left Middle': '#48dbfb',
  'Left Index': '#1dd1a1',
  'Right Index': '#1dd1a1',
  'Right Middle': '#48dbfb',
  'Right Ring': '#feca57',
  'Right Pinky': '#ff6b6b',
  'Thumb': '#a29bfe',
};

const Keyboard = observer(() => {
  const { currentChar, currentFinger } = typingStore;
  const targetKey = currentChar.toLowerCase();

  return (
    <Box sx={{ p: 3, background: '#1d1d1f', borderRadius: 3 }}>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: currentFinger.fingerColor, mb: 0.5 }}>
          Use: {currentFinger.finger}
        </Typography>
        <Typography variant="body2" sx={{ color: '#86868b' }}>
          {currentFinger.hand === 'left' ? '← Left Hand' : 'Right Hand →'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
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
              const fingerInfo = FINGER_MAP[key];
              const fingerColor = fingerInfo ? FINGER_COLORS[fingerInfo.finger] : '#444';
              const isHighlighted = isTarget;

              return (
                <Box
                  key={key}
                  sx={{
                    width: key === ' ' ? 200 : 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    backgroundColor: isHighlighted ? fingerColor : '#2d2d2f',
                    border: isHighlighted ? `2px solid ${fingerColor}` : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isHighlighted ? `0 0 20px ${fingerColor}40` : 'none',
                    transition: 'all 0.1s ease',
                    transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <Typography
                    sx={{
                      color: isHighlighted ? '#000' : '#f5f5f7',
                      fontWeight: isHighlighted ? 700 : 400,
                      fontSize: key === ' ' ? 12 : 14,
                      textTransform: key === ' ' ? 'uppercase' : 'none',
                    }}
                  >
                    {key === ' ' ? 'space' : key}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {Object.entries(FINGER_COLORS).map(([finger, color]) => (
          <Box key={finger} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
            <Typography variant="caption" sx={{ color: '#86868b', fontSize: 10 }}>
              {finger}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default Keyboard;
