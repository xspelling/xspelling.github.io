import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Header from './components/Header';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Garage from './pages/Garage';
import Shop from './pages/Shop';
import Friends from './pages/Friends';
import Leagues from './pages/Leagues';
import News from './pages/News';
import VIP from './pages/VIP';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/news" element={<News />} />
          <Route path="/vip" element={<VIP />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
