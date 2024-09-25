import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';

// Check if browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechComponent = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Text-to-Speech handler
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech not supported in this browser.');
    }
  };

  // Speech-to-Text handler
  const handleListen = () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // Set language to English
      recognition.interimResults = false; // Only final results
      recognition.maxAlternatives = 1;

      if (!isListening) {
        recognition.start();
        setIsListening(true);
        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setText((prevText) => `${prevText} ${speechResult}`);
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error(event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      alert('Speech-to-Text not supported in this browser.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h5">Text-to-Speech and Speech-to-Text</Typography>
      
      {/* Text Input for TTS and Display for STT */}
      <TextField
        label="Enter or Speak Text"
        variant="outlined"
        multiline
        rows={4}
        value={text}
        onChange={handleTextChange}
      />

      {/* Speak Button */}
      <Button variant="contained" color="primary" onClick={handleSpeak}>
        Speak (TTS)
      </Button>

      {/* Listen Button */}
      <Button variant="contained" color={isListening ? 'secondary' : 'primary'} onClick={handleListen}>
        {isListening ? 'Stop Listening (STT)' : 'Start Listening (STT)'}
      </Button>
    </Box>
  );
};

export default SpeechComponent;
