import React from 'react';
import { Box, keyframes } from '@mui/material';

// Define the keyframes for the bounce animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Dot component with animation
const Dot = ({ delay,color="white"}) => (
  <Box
    sx={{
      width: 8,
      height: 8,
      bgcolor: color,
      borderRadius: '50%',
      display: 'inline-block',
      mx: 0.5,
      animation: `${bounce} 1.4s infinite ease-in-out both`,
      animationDelay: delay,
    }}
  />
);

// TypingIndicator component with three animated dots
const TypingIndicator = ({color}) => (
  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
    <Dot delay="-0.32s" color={color}/>
    <Dot delay="-0.16s" color={color}/>
    <Dot delay="0s" color={color}/>
  </Box>
);

export default TypingIndicator;
