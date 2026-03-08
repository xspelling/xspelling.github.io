import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, Card, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { raceStore, typingStore, articleStore } from '../stores';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AddIcon from '@mui/icons-material/Add';
import type { Player } from '../types';

function RaceCar({ player, isCurrentPlayer }: { player: Player; isCurrentPlayer: boolean }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: player.color, fontWeight: 600 }}>{player.name}</Typography>
        {isCurrentPlayer && <Typography sx={{ color: '#0071e3', fontSize: 12 }}>You</Typography>}
      </Box>
      <Box sx={{ 
        height: 40, 
        background: '#2d2d2f', 
        borderRadius: 2, 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            position: 'absolute',
            left: `${player.progress}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'left 0.3s ease',
          }}
        >
          <Box sx={{ 
            fontSize: 28, 
            filter: `drop-shadow(0 0 8px ${player.color})`,
          }}>
            🚗
          </Box>
        </Box>
        <Box sx={{ 
          position: 'absolute', 
          right: 10, 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: 20,
          height: 20,
          background: 'repeating-linear-gradient(45deg, #fff, #fff 5px, #000 5px, #000 10px)',
          borderRadius: 2,
        }} />
      </Box>
      <Typography variant="caption" sx={{ color: '#86868b' }}>{player.wpm} WPM</Typography>
    </Box>
  );
}

const Race = observer(() => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const store = raceStore;
  const typing = typingStore;
  
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('Player');
  const [selectedText, setSelectedText] = useState(articleStore.articles[0]?.content || '');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (roomCode && store.currentRoom) {
      setGameStarted(store.currentRoom.status === 'racing');
    }
  }, [roomCode, store.currentRoom]);

  const handleCreateRoom = () => {
    const code = store.createRoom(selectedText);
    setCreateDialogOpen(false);
    navigate(`/race/${code}`);
  };

  const handleJoinRoom = () => {
    if (joinCode.length === 6) {
      const joined = store.joinRoom(joinCode);
      if (joined) {
        navigate(`/race/${joinCode}`);
      }
    }
  };

  const handleStartRace = () => {
    store.startRace();
    setGameStarted(true);
    typing.setText(store.currentRoom?.text || '');
    typing.startTyping();
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || !store.currentRoom || store.currentRoom.status !== 'racing') return;
    
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      typing.handleKeyPress(e.key);
      store.updateProgress(typing.progress, typing.wpm);
    }
  }, [gameStarted, store, typing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        store.simulateOtherPlayers();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameStarted, store]);

  if (roomCode && store.currentRoom) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#000', pt: 8, pb: 4 }}>
        <Container maxWidth="md">
          <Card sx={{ background: '#1d1d1f', p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ color: '#f5f5f7' }}>
                Room: {roomCode}
              </Typography>
              <Button 
                color="error" 
                size="small"
                onClick={() => {
                  store.leaveRoom();
                  navigate('/race');
                }}
              >
                Leave
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              {store.currentRoom.players.map((player) => (
                <RaceCar 
                  key={player.id} 
                  player={player}
                  isCurrentPlayer={player.id === store.playerId}
                />
              ))}
            </Box>
          </Card>

          {store.currentRoom.status === 'waiting' && (
            <Card sx={{ background: '#1d1d1f', p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#86868b' }}>
                Waiting for players...
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#86868b' }}>
                Share the room code with friends to join!
              </Typography>
              {store.isHost && (
                <Button
                  variant="contained"
                  onClick={handleStartRace}
                  disabled={store.currentRoom.players.length < 1}
                  sx={{ background: '#30d158' }}
                >
                  Start Race
                </Button>
              )}
            </Card>
          )}

          {store.winner && (
            <Card sx={{ background: '#1d1d1f', p: 4, textAlign: 'center', mt: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, color: '#ffd60a' }}>
                🏆 {store.winner} Wins!
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  store.leaveRoom();
                  navigate('/race');
                }}
                sx={{ background: '#0071e3' }}
              >
                Play Again
              </Button>
            </Card>
          )}

          {gameStarted && !store.winner && (
            <Card sx={{ background: '#1d1d1f', p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#f5f5f7' }}>Your Progress</Typography>
              <LinearProgress 
                variant="determinate" 
                value={typing.progress}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#2d2d2f',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#30d158' }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography sx={{ color: '#30d158', fontWeight: 600 }}>{typing.wpm} WPM</Typography>
                <Typography sx={{ color: '#86868b' }}>{Math.round(typing.progress)}%</Typography>
              </Box>
            </Card>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#000', pt: 8, pb: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <SportsScoreIcon sx={{ fontSize: 80, color: '#ff6b6b', mb: 2 }} />
          <Typography variant="h2" sx={{ mb: 2, color: '#f5f5f7' }}>
            Race Mode
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b' }}>
            Create a room and race against friends!
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card 
              onClick={() => setCreateDialogOpen(true)}
              sx={{ 
                background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)',
                p: 4, 
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
                '&:hover': { borderColor: '#30d158', transform: 'scale(1.02)' }
              }}
            >
              <AddIcon sx={{ fontSize: 60, color: '#30d158', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, color: '#f5f5f7' }}>Create Room</Typography>
              <Typography variant="body2" sx={{ color: '#86868b' }}>
                Start a new race and invite friends
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card 
              onClick={() => setJoinDialogOpen(true)}
              sx={{ 
                background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)',
                p: 4, 
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
                '&:hover': { borderColor: '#0071e3', transform: 'scale(1.02)' }
              }}
            >
              <Typography variant="h1" sx={{ mb: 1, color: '#0071e3' }}>🔗</Typography>
              <Typography variant="h5" sx={{ mb: 1, color: '#f5f5f7' }}>Join Room</Typography>
              <Typography variant="body2" sx={{ color: '#86868b' }}>
                Enter a room code to join a race
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          PaperProps={{ sx: { background: '#1d1d1f', borderRadius: 3, p: 2 } }}
        >
          <DialogTitle sx={{ color: '#f5f5f7' }}>Create Race Room</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 8))}
              sx={{ mt: 2, mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2d2d2f',
                  color: '#f5f5f7',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
                '& .MuiInputLabel-root': { color: '#86868b' },
              }}
            />
            <TextField
              fullWidth
              select
              label="Select Text"
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2d2d2f',
                  color: '#f5f5f7',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
                '& .MuiInputLabel-root': { color: '#86868b' },
              }}
            >
              {articleStore.articles.map((article) => (
                <option key={article.id} value={article.content}>
                  {article.title}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#86868b' }}>Cancel</Button>
            <Button onClick={handleCreateRoom} variant="contained" sx={{ background: '#30d158' }}>Create</Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={joinDialogOpen} 
          onClose={() => setJoinDialogOpen(false)}
          PaperProps={{ sx: { background: '#1d1d1f', borderRadius: 3, p: 2 } }}
        >
          <DialogTitle sx={{ color: '#f5f5f7' }}>Join Race Room</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 8))}
              sx={{ mt: 2, mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2d2d2f',
                  color: '#f5f5f7',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
                '& .MuiInputLabel-root': { color: '#86868b' },
              }}
            />
            <TextField
              fullWidth
              label="Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2d2d2f',
                  color: '#f5f5f7',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
                '& .MuiInputLabel-root': { color: '#86868b' },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinDialogOpen(false)} sx={{ color: '#86868b' }}>Cancel</Button>
            <Button onClick={handleJoinRoom} variant="contained" disabled={joinCode.length !== 6}>Join</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
});

export default Race;
