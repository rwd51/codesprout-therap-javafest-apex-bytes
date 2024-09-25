import React from "react";

//MUI
import { Avatar, Box, Tooltip } from "@mui/material";

const lightColors = {
  "Rookie": "#A3B8D4", // Light version of #334B71
 "Explorer": "#D4EEF2", // Light version of #90D1DB
  "Conqueror": "#FEFBE8", // Light version of #faf6c0
  "Master Builder": "#FFC1CC", // Light pink
};

const darkColors = {
    "Rookie":"#334B71", // Dark version corresponding to the first color
    "Explorer":"#90D1DB", // Dark version corresponding to the second color
    "Conqueror":"#FAF6C0", // Dark version corresponding to the third color
    "Master Builder":"#D95362", // Dark pink
};

function Tags({ tag }) {
  return (
    <Tooltip title={tag}>
      <Avatar
        src={`${window.location.origin}/Tags/tags_list/${tag}.svg`}
        sx={{
          height: 60,
          width: 60,
          border: "3px solid black",
          bgcolor: lightColors[tag],
          "&:hover": {
            border: "7px solid black",
            bgcolor: darkColors[tag],
          },
        }}
      />
    </Tooltip>
  );
}

export default Tags;
