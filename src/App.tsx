import React, { FunctionComponent, useState, ChangeEvent } from "react";
import { Container, Typography, TextField, Button, Box, IconButton, AppBar, Toolbar, Menu, MenuItem, Tooltip } from "@mui/material";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
interface AppProps { }

const App: FunctionComponent<AppProps> = () => {
  const [word, setWord] = useState<string>(""); // FastAPI 返回的单词
  const [input, setInput] = useState<string>(""); // 用户输入
  const [feedback, setFeedback] = useState<string>("");
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  // 获取随机单词
  const fetchWord = async (): Promise<void> => {
    try {
      const res = await fetch("https://xspelling.duckdns.org/api/get_word");
      const data = await res.json();
      setWord(data.result);
      setInput("");
      setFeedback("");
    } catch (err) {
      console.error("Failed to fetch word:", err);
    }
  };

  // 播放语音（FastAPI 提供 TTS 接口）
  const playWord = async (): Promise<void> => {
    try {
      const res = await fetch(`https://xspelling.duckdns.org/api/pronounce?word=${encodeURIComponent(word)}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.play().catch((e) => {
        console.error("Autoplay blocked or failed:", e);
      });

    } catch (err) {
      console.error("Failed to play word:", err);
    }
  };

  const checkSpelling = (): void => {
    const isCorrect = input.trim().toLowerCase() === word.toLowerCase();

    if (isCorrect) {
      setFeedback("✅ Correct!");
      new Audio("/correct.mp3").play();
    } else {
      setFeedback(`❌ Incorrect. The word was "${word}"`);
      new Audio("/wrong.mp3").play();
    }
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout', 'Home'];


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const pages = ['Products', 'Pricing', 'Blog'];
  return (
    <Box >
      <AppBar >
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Spelling bee
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box display="flex" gap={2} mb={3} mt="100px">
        <Button variant="contained" color="primary" onClick={fetchWord}>
          Get Word
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={playWord}
          disabled={!word}
        >
          Play Word
        </Button>
      </Box>
      {word && (
        <Box mb={3}>
          <TextField
            label="Type the word"
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
          />
        </Box>
      )}

      {word && (
        <Button variant="contained" color="success" onClick={checkSpelling}>
          Submit
        </Button>
      )}

      {feedback && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          {feedback}
        </Typography>
      )}
    </Box>
  );
};

export default App;