import React, { useState } from 'react';

//MUI
import { CssBaseline, Box, Drawer, List, ListItem, ListItemText, Typography, AppBar, Toolbar, TextField, Stack, Avatar, IconButton, InputAdornment } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';


//components
import CodeSproutIcon from '../misc/CodeSproutIcon';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true); // Initially true if you want the drawer open by default

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate a response from ChatGPT
      setTimeout(() => {
        setMessages(msgs => [...msgs, { text: 'This is a response from ChatBot.', sender: 'bot' }]);
      }, 500);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', border: '2px solid red' }}>
        <AppBar position="fixed" sx={{ width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%', ml: drawerOpen ? `${drawerWidth}px` : 0 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap display='flex' gap='1rem'alignItems='center' fontWeight='bold'>
              <CodeSproutIcon/> ChatBot
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {['Today', 'Yesterday', 'Previous 7 Days'].map((text) => (
                <ListItem button key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%', ml: drawerOpen ? `${drawerWidth}px` : 0, mr: drawerOpen ? `${drawerWidth}px` : `${drawerWidth}px`, border: '2px solid green' }}>
          <Toolbar />
          <Box sx={{ flexGrow: 1, overflowY: 'auto', border: '2px solid blue' }}>
            {messages.map((msg, index) => (
              <Stack key={index} direction="row" spacing={2} sx={{
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                margin: '10px', border: '2px solid white'
              }}>
                {msg.sender === 'bot' && (
                  <CodeSproutIcon/>
                )}
                <Box sx={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  backgroundColor: msg.sender === 'user' ? '#1976d2' : '#424242',
                  color: 'white',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',  // Ensure newlines are respected
                }}>
                  {msg.text}
                </Box>
                {msg.sender === 'user' && (
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    U
                  </Avatar>
                )}
              </Stack>
            ))}
          </Box>
          <Box sx={{ padding: 3, backgroundColor: '#121212', display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              maxRows={7}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                mr: 1,
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '40px', // Adjusted borderRadius
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton color="primary">
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <MicIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={sendMessage} color="primary">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ChatBot;
