import { Box, Container, Typography, Grid, Card, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { userStore } from '../stores';

const mockUsers = [
  { id: 'u1', username: 'SpeedyG', avatar: '🏎️', level: 15, league: 'Gold' },
  { id: 'u2', username: 'TypeMaster', avatar: '🎯', level: 22, league: 'Platinum' },
  { id: 'u3', username: 'FlashRacer', avatar: '⚡', level: 8, league: 'Silver' },
  { id: 'u4', username: 'KeyboardKing', avatar: '👑', level: 30, league: 'Diamond' },
];

const Friends = observer(() => {
  const user = userStore;
  const [search, setSearch] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  const filteredUsers = mockUsers.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) && 
    !user.user.friends.includes(u.id)
  );

  const handleAddFriend = (id: string) => {
    alert('Friend request sent!');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pt: 8, pb: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 3, color: '#f8fafc' }}>👥 Friends</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>Your Friends ({user.user.friends.length})</Typography>
              
              {user.user.friends.length === 0 ? (
                <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>No friends yet</Typography>
              ) : (
                <List>
                  {user.user.friends.map(friendId => {
                    const friend = mockUsers.find(u => u.id === friendId);
                    if (!friend) return null;
                    return (
                      <ListItem key={friendId} sx={{ backgroundColor: '#0f172a', borderRadius: 1, mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: '#6366f1' }}>{friend.avatar}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={friend.username} 
                          secondary={`Level ${friend.level} • ${friend.league}`}
                          primaryTypographyProps={{ sx: { color: '#f8fafc' } }}
                          secondaryTypographyProps={{ sx: { color: '#64748b' } }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: '#1e293b' }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#f8fafc' }}>Find Friends</Typography>
              
              <TextField
                fullWidth
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#0f172a' } }}
              />

              <List>
                {filteredUsers.map(u => (
                  <ListItem key={u.id} sx={{ backgroundColor: '#0f172a', borderRadius: 1, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: '#6366f1' }}>{u.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={u.username} 
                      secondary={`Level ${u.level} • ${u.league}`}
                      primaryTypographyProps={{ sx: { color: '#f8fafc' } }}
                      secondaryTypographyProps={{ sx: { color: '#64748b' } }}
                    />
                    <Button 
                      size="small" 
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleAddFriend(u.id)}
                      sx={{ color: '#6366f1' }}
                    >
                      Add
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default Friends;
