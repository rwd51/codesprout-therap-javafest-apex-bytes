import React, { useEffect } from "react";

//MUI
import { Box } from "@mui/material";

//components
import ImageSlideShow from "./ImageSlideShow";
import Description from "./Description";
import LoginRegisterView from "./LoginRegisterView";

function Parents({ setAuth, setUserType, setUserID, setIsLoading }) {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);
  //slideshow image array
  const images = [
    "/Parentpage/parent.gif",
    // "/logo512.png",
    // "/logo.avif"
  ];

  //website descriptions array
  const descriptions = [
    {
      title: "View Performance metrics",
      content:
        "View your children's performance metrics, and other relevant data. You can also view a personalised progress report.",
      img: "/Parentpage/stats.gif",
      reverse: false, //false: order of content and img is not reversed
    },
    {
      title: "View Code",
      content:
        "You can also view the codes of your child's projects in a view-only-mode",
      img: "/Parentpage/code.gif",
      reverse: true, //true: order of content and img is reversed
    },
  ];

  return (
    <>
      <ImageSlideShow images={images} height="500px" />{" "}
      {/** images= array of images, height= height of the slideshow box */}
      <Box sx={{ p: 10, backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
        {" "}
        {/**p= padding (for sx props) */}
        <Description descriptions={descriptions} />{" "}
        {/** descriptions= array of descriptions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "60vh", // Full viewport height
            marginTop: 6,
          }}
        >
          <img src={`${window.location.origin}/Parentpage/login.gif`}/>
          <LoginRegisterView
            setAuth={setAuth}
            setUserType={setUserType}
            setUserID={setUserID}
            setIsLoading={setIsLoading}
            type={"parents"}
          />
        </Box>
      </Box>
    </>
  );
}

export default Parents;
