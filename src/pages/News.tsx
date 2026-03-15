import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { articleStore } from '../stores';
import { categories } from '../data/articles';
import { categoryColors, difficultyColors } from '../types';

const News = observer(() => {
  const navigate = useNavigate();
  const store = articleStore;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pt: 8 }}>
      <Box sx={{ background: '#fff', py: 4, borderBottom: '1px solid #e5e5ea' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 1, color: '#1d1d1f', fontWeight: 700 }}>
            Latest News
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868b' }}>
            Stay informed with our curated collection of articles
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search articles..."
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: 2,
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

              <TextField
                select
                value={store.categoryFilter}
                onChange={(e) => store.setCategoryFilter(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                value={store.difficultyFilter}
                onChange={(e) => store.setDifficultyFilter(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Box>

            <Grid container spacing={3}>
              {store.filteredArticles.map((article) => (
                <Grid item xs={12} sm={6} key={article.id}>
                  <Card
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={article.imageUrl}
                        alt={article.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      {article.isPremium && (
                        <Chip 
                          icon={<WorkspacePremiumIcon sx={{ fontSize: 12 }} />}
                          label="PRO"
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', 
                            color: '#000',
                            fontWeight: 700,
                            fontSize: 10,
                            height: 22,
                          }} 
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{
                            backgroundColor: `${categoryColors[article.category]}15`,
                            color: categoryColors[article.category],
                            fontWeight: 500,
                            fontSize: 10,
                            textTransform: 'capitalize',
                            height: 22,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: '#1d1d1f',
                          mb: 1,
                          fontWeight: 600,
                          fontSize: 16,
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
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {article.excerpt}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: '#86868b' }} />
                          <Typography variant="caption" sx={{ color: '#86868b' }}>
                            {article.readTime} min
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#86868b' }}>
                          {article.publishedAt}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {store.filteredArticles.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#86868b' }}>
                  No articles found
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868b', mt: 1 }}>
                  Try adjusting your search or filters
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 80, background: '#fff' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#ff6b6b' }} />
                  <Typography variant="h6" sx={{ color: '#1d1d1f', fontWeight: 600 }}>
                    Trending
                  </Typography>
                </Box>

                {store.latestArticles.slice(0, 5).map((article, index) => (
                  <Box 
                    key={article.id}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      mb: 2, 
                      pb: 2, 
                      borderBottom: index < 4 ? '1px solid #f5f5f7' : 'none',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.7 }
                    }}
                  >
                    <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0071e3', width: 24 }}>
                      {index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#1d1d1f', fontWeight: 500, lineHeight: 1.3 }}>
                        {article.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#86868b' }}>
                        {article.readTime} min read
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {!store.isPremiumUser && (
                  <Box sx={{ mt: 3, p: 2, background: 'linear-gradient(135deg, #f5a62315 0%, #f5d02315 100%)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1d1d1f' }}>
                      Unlock Premium Articles
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#86868b', mb: 2, display: 'block' }}>
                      Get access to exclusive content
                    </Typography>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => navigate('/premium')}
                      sx={{ background: 'linear-gradient(135deg, #f5a623 0%, #f5d023 100%)', color: '#000', fontWeight: 600 }}
                    >
                      Upgrade
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default News;
