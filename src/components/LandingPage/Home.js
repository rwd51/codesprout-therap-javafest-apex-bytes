import React, { useEffect } from "react";

//MUI
import { Box } from "@mui/material";

//import components
import ImageSlideShow from "./ImageSlideShow";
import Description from "./Description";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  //slideshow image array
  const images = ["/HomePage/coding.gif"];

  //website descriptions array
  const descriptions = [
    {
      title: "Enhance Problem Solving Skills",
      content:
        "With a rich collection of problems categorized accordin to difficulty, you can enhance your math and logical thinking skills.",
      img: "/HomePage/maths.gif",
      reverse: false, //false: order of content and img is not reversed
    },
    {
      title: "Performance Metrics",
      content:
        "You will get personalized performance metrics and achievements based on your coding (making project and solving problems) performance.",
      img: "/HomePage/stats.gif",
      reverse: true, //true: order of content and img is reversed
    },
    {
      title: "Chat Bot and Coding Assistant",
      content:
        "An AI coding assistant will be present in the coding editor to guide you throughout your journey. Also there will be a general purpose chat bot where you can ask generic question regarding this app's block based coding",
      img: "/HomePage/robot.gif",
      reverse: false,
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
      </Box>
    </>
  );
}

export default Home;
