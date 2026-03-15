import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Header from './components/Header';
import Home from './pages/Home';
import News from './pages/News';
import Premium from './pages/Premium';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/premium" element={<Premium />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
