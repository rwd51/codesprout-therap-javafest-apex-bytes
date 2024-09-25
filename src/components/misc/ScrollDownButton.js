import React from "react";

//MUI
import { Tooltip, IconButton } from "@mui/material";

//icons
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const scrollDown = (id) => {
  const element = document.getElementById(`${id}`);
  console.log(element)
  element.scrollTo({
    top: element.scrollHeight,
    behavior: "smooth",
  });
};
function ScrollDownButton({
  id,
  iconColor = "black",
  iconBackgroundColor = "white",
  iconColorOnHover = "white",
  iconBackgroundColorOnHover = "black",
  tooltipLabel,
  left="50%",
}) {
  return (
    <Tooltip title={tooltipLabel}>
      <IconButton
        onClick={()=>scrollDown(id)}
        sx={{
          position: "absolute",
          bottom: "10px",
          left: left,
          transform: "translateX(-50%)",
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
        <ArrowDownwardIcon />
      </IconButton>
    </Tooltip>
  );
}

export default ScrollDownButton;
