import React, { FunctionComponent, useState, ChangeEvent } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

interface AppProps { }

const App: FunctionComponent<AppProps> = () => {
  const [word, setWord] = useState<string>(""); // FastAPI 返回的单词
  const [input, setInput] = useState<string>(""); // 用户输入
  const [feedback, setFeedback] = useState<string>("");

  // 获取随机单词
  const fetchWord = async (): Promise<void> => {
    try {
      const res = await fetch("http://159.54.164.193:8000/api/get_word");
      const data = await res.json();
      setWord(data.word);
      setInput("");
      setFeedback("");
    } catch (err) {
      console.error("Failed to fetch word:", err);
    }
  };

  // 播放语音（FastAPI 提供 TTS 接口）
  const playWord = async (): Promise<void> => {
    try {
      const res = await fetch(`/api/pronounce?word=${word}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("Failed to play word:", err);
    }
  };

  // 校验拼写
  const checkSpelling = (): void => {
    if (input.trim().toLowerCase() === word.toLowerCase()) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect. The word was "${word}"`);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        George's Spelling Practice
      </Typography>

      <Box display="flex" gap={2} mb={3}>
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
    </Container>
  );
};

export default App;