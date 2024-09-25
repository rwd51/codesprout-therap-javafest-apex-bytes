import React, { useState } from 'react';

//MUI
import {
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';

//values
import { TITLE_THICK, TITLE, CONTENT } from '../../../../values/Fonts';

// Transition component for sliding the Snackbar
const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  };

const WrongSubmissionErrorMessage = ({open,setOpen}) => {

  // Function to close the Snackbar
  const handleClose = (event, reason) => {
    // Prevent closing the Snackbar when clicking away
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };



  return (
    <div>
      {/* Snackbar Component */}
      <Snackbar
        open={open}
        autoHideDuration={6000} // Duration in milliseconds
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Position at bottom-right
        TransitionComponent={SlideTransition} // Slide transition from right to left
      >
        {/* Alert Component for Styling */}
        <Alert
          onClose={handleClose}
          severity="error" // Sets the color to red and icon to error
          sx={{ width: '100%', fontFamily: CONTENT, fontWeight: 'bold',
          '&:hover': {
            bgcolor: 'orange', // Desired background color on hover
            color: '#000000',   // Desired text color on hover
          }, }} // Full width within the Snackbar
          variant="filled" // Filled variant for solid background
        >
          Wrong Answer
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WrongSubmissionErrorMessage;
