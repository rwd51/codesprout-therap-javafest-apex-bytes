import React, {useEffect} from "react";

//MUI
import { Box } from "@mui/material";

//components
import LoginRegisterView from "./LoginRegisterView";

const GetStarted = ({setAuth, setUserType, setUserID, setIsLoading}) => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        backgroundColor: "#f0f0f0", // Optional: Light grey background color
        backgroundImage: 'url("/LoginRegisterView/login_register.gif")', // Add your image URL here
        //backgroundSize: 'cover', // Cover the entire Box area
        backgroundPosition: "center", // Center the background image
        backgroundRepeat: "no-repeat", // Do not repeat the background image
        padding: 3,
        marginTop: 6,
        pt:15,
        pb:15,
      }}
    >
      <LoginRegisterView setAuth={setAuth} setUserType={setUserType} setUserID={setUserID} setIsLoading={setIsLoading} type={"kids"}/>
    </Box>
  );
};

export default GetStarted;
