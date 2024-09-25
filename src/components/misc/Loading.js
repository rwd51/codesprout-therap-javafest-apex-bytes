import React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";


const Spinner = styled(Box)({
  border: "4px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
});

const SpinnerImage = styled(Box)({
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "50%",
  animation: "counterSpin 1s linear infinite",

  "@keyframes counterSpin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(-360deg)",
    },
  },
});

const Loading = ({
  sprinnerWidth = "250px",
  spinnerHeight = "250px",
  spinnerImageWidth = "200px",
  spinnerImageHeight = "200px",
  spinnerColor = "black",
  spinnerBackgroundColor = "#f0f0f0",
  spinnerLogoURL,
}) => {
  return (
    <Spinner
      sx={{
        width: sprinnerWidth,
        height: spinnerHeight,
        borderLeftColor: spinnerColor,
        backgroundColor: spinnerBackgroundColor,
      }}
    >
      <SpinnerImage
        sx={{
          width: spinnerImageWidth,
          height: spinnerImageHeight,
          backgroundImage: spinnerLogoURL? `url(${spinnerLogoURL})`: 'none',
        }}
      />
    </Spinner>
  );
};

export default Loading;
