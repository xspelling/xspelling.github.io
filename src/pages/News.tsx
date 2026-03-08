import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, TextField, MenuItem, Chip, InputAdornment, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { articleStore } from '../stores';

const categoryColors: Record<string, string> = {
  tech: '#0071e3',
  science: '#30d158',
  business: '#ffd60a',
  lifestyle: '#ff6b6b',
};

const difficultyColors: Record<string, string> = {
  beginner: '#30d158',
  intermediate: '#ffd60a',
  advanced: '#ff453a',
};

const News = observer(() => {
  const store = articleStore;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ mb: 2, color: '#1d1d1f' }}>
            Article Library
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b', mb: 4 }}>
            Practice typing with articles from various categories
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search articles..."
              value={store.searchQuery}
              onChange={(e) => store.setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#86868b' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': { borderColor: '#d2d2d7' },
                  '&:hover fieldset': { borderColor: '#0071e3' },
                },
              }}
            />

            <TextField
              select
              value={store.categoryFilter}
              onChange={(e) => store.setCategoryFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': { borderColor: '#d2d2d7' },
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="science">Science</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="lifestyle">Lifestyle</MenuItem>
            </TextField>

            <TextField
              select
              value={store.difficultyFilter}
              onChange={(e) => store.setDifficultyFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': { borderColor: '#d2d2d7' },
                },
              }}
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {store.filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={article.imageUrl}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        backgroundColor: `${categoryColors[article.category]}15`,
                        color: categoryColors[article.category],
                        fontWeight: 500,
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
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1d1d1f',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      flexGrow: 1,
                    }}
                  >
                    {article.content}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#86868b' }} />
                      <Typography variant="caption" sx={{ color: '#86868b' }}>
                        {article.readTime} min
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#86868b' }}>
                        {article.wordCount} words
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => store.toggleBookmark(article.id)}
                        sx={{ color: store.isBookmarked(article.id) ? '#ffd60a' : '#86868b' }}
                      >
                        {store.isBookmarked(article.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {store.filteredArticles.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#86868b' }}>
              No articles found
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868b', mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
});

export default News;
