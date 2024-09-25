import React from "react";

//MUI
import { Avatar, Box, Tooltip } from "@mui/material";

const lightColors = [
    "#A3B8D4", // Light version of #334B71
    "#D4EEF2", // Light version of #90D1DB
    "#FEFBE8", // Light version of #faf6c0
    "#FFC1CC", // Light pink
    "#E3D8F1", // Light purple
    "#F5E1C9", // Light beige
    "#B5D8B8", // Light green
    "#FFD6A5", // Light orange
    "#FFE0B5", // Light peach
    "#E1F0D7", // Light lime green
    "#FDEBCD", // Light cream
    "#D7E5F2", // Light sky blue
    "#F8D5C7", // Light coral
    "#D1F2E5", // Light mint
    "#FAE3E3", // Light rose
    "#FDF6E3", // Light ivory
    "#FAF5D9", // Light vanilla
    "#E6F2E6", // Light seafoam green
    "#FFECE6", // Light apricot
    "#F9E3C4", // Light sand
  ];
  
  const darkColors = [
    "#334B71", // Dark version corresponding to the first color
    "#90D1DB", // Dark version corresponding to the second color
    "#FAF6C0", // Dark version corresponding to the third color
    "#D95362", // Dark pink
    "#8C4A92", // Dark purple
    "#926D4C", // Dark beige
    "#4D774E", // Dark green
    "#D77E3F", // Dark orange
    "#C06E34", // Dark peach
    "#6B8E23", // Dark lime green
    "#D1B18C", // Dark cream
    "#5A7491", // Dark sky blue
    "#C66F57", // Dark coral
    "#43996B", // Dark mint
    "#9B4545", // Dark rose
    "#D5C39B", // Dark ivory
    "#D1BF89", // Dark vanilla
    "#5E8675", // Dark seafoam green
    "#C16A51", // Dark apricot
    "#B28861", // Dark sand
  ];
  

function Interests({intersts}) {
  return (
<>
      {intersts.map((interest, index) => (
        <Tooltip title={interest}>
          <Avatar
            src={`${window.location.origin}/Interests/interests_list/${interest}.svg`}
            sx={{
              height: 60,
              width: 60,
              border: "3px solid black",
              bgcolor: lightColors[index],
              "&:hover": {
                border: "7px solid black",
                bgcolor: darkColors[index],
              },
            }}
          />
        </Tooltip>
      ))}
    </>
  );
}

export default Interests;
