import React from "react";

//MUI
import { Tooltip, IconButton } from "@mui/material";

//icons
import { FaArrowRightLong } from "react-icons/fa6";

const scrollRight = (id) => {
    console.log(id)
    const element = document.getElementById(`${id}`);
    console.log(element);
    element.scrollTo({
      left: element.scrollWidth, // Scrolls to the right edge
      behavior: "smooth",        // Smooth scroll
    });
  };
function ScrollRightButton({
  id,
  iconColor = "black",
  iconBackgroundColor = "white",
  iconColorOnHover = "white",
  iconBackgroundColorOnHover = "black",
  tooltipLabel,
  top = "50%",
  right="10px",
}) {
  return (
    <Tooltip title={tooltipLabel}>
      <IconButton
        onClick={() => scrollRight(id)}
        sx={{
          position: "absolute",
          right: right,
          top: top,
          transform: "translateY(50%)",
          color: iconColor,
          backgroundColor: iconBackgroundColor,
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 1)",
          "&:hover": {
            color: iconColorOnHover,
            backgroundColor: iconBackgroundColorOnHover,
          },
        }}
      >
        <FaArrowRightLong />
      </IconButton>
    </Tooltip>
  );
}

export default ScrollRightButton;
