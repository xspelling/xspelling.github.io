import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Header from './components/Header';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Race from './pages/Race';
import News from './pages/News';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/race" element={<Race />} />
          <Route path="/race/:roomCode" element={<Race />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
