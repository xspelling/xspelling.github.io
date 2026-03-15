import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, Button, TextField, MenuItem, InputAdornment } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { articleStore } from '../stores';
import { categories, difficulties } from '../data/articles';
import { categoryColors, difficultyColors } from '../types';

const Home = observer(() => {
  const navigate = useNavigate();
  const store = articleStore;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7' }}>
      <Box sx={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        pt: 12,
        pb: 6,
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 2, color: '#1d1d1f', fontWeight: 700 }}>
            Read. Learn. Grow.
          </Typography>
          <Typography variant="h5" sx={{ color: '#86868b', mb: 4, fontWeight: 400 }}>
            Your gateway to endless knowledge and stories
          </Typography>
          
          <TextField
            placeholder="Search articles..."
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            size="small"
            sx={{ 
              width: '100%', 
              maxWidth: 500,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: 3,
                '& fieldset': { borderColor: '#d2d2d7' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#86868b' }} />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          <Chip 
            label="All" 
            onClick={() => store.setCategoryFilter('all')}
            sx={{ 
              backgroundColor: store.categoryFilter === 'all' ? '#0071e3' : '#fff',
              color: store.categoryFilter === 'all' ? '#fff' : '#1d1d1f',
              fontWeight: 500,
              '&:hover': { backgroundColor: store.categoryFilter === 'all' ? '#0077ed' : '#f5f5f7' },
            }} 
          />
          {categories.map(cat => (
            <Chip 
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)} 
              onClick={() => store.setCategoryFilter(cat)}
              sx={{ 
                backgroundColor: store.categoryFilter === cat ? categoryColors[cat] : '#fff',
                color: store.categoryFilter === cat ? '#fff' : '#1d1d1f',
                fontWeight: 500,
                '&:hover': { backgroundColor: store.categoryFilter === cat ? categoryColors[cat] : '#f5f5f7' },
              }} 
            />
          ))}
        </Box>

        <Typography variant="h4" sx={{ mb: 3, color: '#1d1d1f', fontWeight: 600 }}>
          Featured Articles
        </Typography>

        <Grid container spacing={3}>
          {store.featuredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                onClick={() => navigate(`/article/${article.id}`)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.imageUrl}
                    alt={article.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  {article.isPremium && (
                    <Chip 
                      icon={<WorkspacePremiumIcon sx={{ fontSize: 14 }} />}
                      label="Premium"
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', 
                        color: '#000',
                        fontWeight: 600,
                        fontSize: 11,
                      }} 
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        backgroundColor: `${categoryColors[article.category]}15`,
                        color: categoryColors[article.category],
                        fontWeight: 500,
                        fontSize: 11,
                        textTransform: 'capitalize',
                      }}
                    />
                    <Chip
                      label={article.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: `${difficultyColors[article.difficulty]}15`,
                        color: difficultyColors[article.difficulty],
                        fontWeight: 500,
                        fontSize: 11,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1d1d1f',
                      mb: 1,
                      fontWeight: 600,
                      fontSize: 17,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#86868b',
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      flexGrow: 1,
                    }}
                  >
                    {article.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#86868b' }} />
                      <Typography variant="caption" sx={{ color: '#86868b' }}>
                        {article.readTime} min read
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#86868b' }}>
                        {article.author}
                      </Typography>
                      <Button 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          store.toggleBookmark(article.id);
                        }}
                        sx={{ minWidth: 32, p: 0.5 }}
                      >
                        {store.isBookmarked(article.id) ? 
                          <BookmarkIcon sx={{ fontSize: 18, color: '#f5a623' }} /> : 
                          <BookmarkBorderIcon sx={{ fontSize: 18, color: '#86868b' }} />
                        }
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/news')}
            sx={{ 
              background: '#0071e3',
              px: 4,
              py: 1.5,
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
});

export default Home;
