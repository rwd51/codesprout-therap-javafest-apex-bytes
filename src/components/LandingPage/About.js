import React, {useEffect} from "react";

//MUI
import { Box } from "@mui/material";

//components
import ImageSlideShow from "./ImageSlideShow";
import Description from "./Description";

function About() {
  console.log("About")
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  //slideshow image array
  const images = [
    "/logo512.png",
    // "/logo512.png",
    // "/logo.avif"
  ];

  //website descriptions array
  const descriptions = [
    {
      title: "Section 1",
      content:
        "Description for Section 1. This section has the image on the left and text on the right.",
      img: "/logo512.png",
      reverse: false, //false: order of content and img is not reversed
    },
    {
      title: "Section 2",
      content:
        "Description for Section 2. This section has the image on the right and text on the left.",
      img: "/logo512.png",
      reverse: true, //true: order of content and img is reversed
    },
    {
      title: "Section 3",
      content:
        "Description for Section 3. This section has the image on the left and text on the right.",
      img: "/logo.avif",
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

export default About;
