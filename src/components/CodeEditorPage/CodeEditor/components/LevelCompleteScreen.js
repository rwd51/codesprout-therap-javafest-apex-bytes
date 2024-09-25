import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

//MUI
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";

//components
import CustomRoundedButton from "../../../misc/CustomRoundedButton";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../../../values/Fonts";
import {
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
  textColorOnHover,
} from "../../../../values/Button";

const LevelCompleteScreen = ({openState=false}) => {
  const { userID } = useParams();

  console.log('bruh')


  const [open, setOpen] = React.useState(openState);

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Prevent modal from closing on backdrop click or pressing Escape
  const handleDialogClose = (event, reason) => {
    // Only allow closing if the reason is 'closeButton'
    if (reason !== "closeButton") {
      return;
    }
    setOpen(false);
  };

  const navigate = useNavigate();

  const gotBackToProblemsPage = (userID) => {
    handleClose();
    navigate(`/kids/${userID}/problems`, { replace: true });
  };

  return (
    <div>
      {/* Trigger Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Modal
      </Button>

      {/* Modal/Dialog */}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        // Disable closing on Escape key
        disableEscapeKeyDown
        // Custom styles to make the modal square and 70% of screen height
        PaperProps={{
          sx: {
            width: "100vh", // Set a fixed width to make it square-ish
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#f1fcf0",
          },
        }}
      >
        {/* Modal Title */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#cefcca",
            "&:hover": { backgroundColor: "#bbfcb6" },
          }}
        >
          <Typography variant="h4" fontFamily={TITLE} fontWeight="bold">
            CONGRATULATIONS
          </Typography>
        </DialogTitle>

        {/* Modal Content */}
        <DialogContent
          dividers
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundImage: `url(${window.location.origin}/LevelComplete/level_complete.gif)`, // Update with your image path
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            gap: "1rem",
            "&:hover": {
              bgcolor: "rgba(255, 253, 184, 0.8)", // Semi-transparent overlay on hover
            },
          }}
        >
          <Typography
            variant="body1"
            fontFamily={CONTENT}
            fontWeight="bold"
            textAlign="center"
            fontSize={40}
          >
            You have successfully completed this level!!
          </Typography>
        </DialogContent>

        {/* Modal Actions */}
        <DialogActions>
          {/* Spacer to push the button to the bottom-right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Close Button */}
          <CustomRoundedButton
            textColor={textColor}
            textColorOnHover={textColorOnHover}
            backgroundColor={buttonBackgroundColor}
            backgroundColorOnHover={buttonBackgroundColorOnHover}
            borderRadius={buttonBorderRadius}
            label={"GO BACK TO PROBLEMS PAGE"}
            handleClick={()=>gotBackToProblemsPage(userID)}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LevelCompleteScreen;
