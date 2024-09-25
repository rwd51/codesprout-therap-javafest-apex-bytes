import React from "react";

//components
import Loading from "./Loading";

function FullScreenLoading() {
  return (
    <div
      onClick={(e)=> e.stopPropagation()}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#edffe8",
      }}
    >
      <Loading
        spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
        sprinnerWidth="350px"
        spinnerHeight="350px"
        spinnerImageWidth="300px"
        spinnerImageHeight="300px"
        spinnerColor="#334B71"
        spinnerBackgroundColor="#ebfdff"
      />
    </div>
  );
}

export default FullScreenLoading;
