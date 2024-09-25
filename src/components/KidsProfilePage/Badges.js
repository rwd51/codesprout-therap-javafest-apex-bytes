import React from "react";

//MUI
import { Avatar, Box, Tooltip } from "@mui/material";

const badges = [
  "Puzzle Prodigy",
  "Code Voyager",
  "Logic Builder",
  "Pathfinder",
  "Speedy Solver",
  "Determined Challenger",
  "Team Player",
  "Project Architect",
  "Badge Hunter",
];

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
];

const badgeDescriptions = [
  "Puzzle Prodigy: Solved 10 Advanced Problems",
  "Code Voyager: Has Expertise in Using All of The Blocks",
  "Logic Builder: Has Expertise in Using Logic and Iterative Blocks",
  "PathFinder: Can Make Proficient Use of The Move Blocks",
  "SpeedySolver: Within the Top 20 Problem Solvers",
  "Determined Challenger: Has the Maximum Number of Projects",
  "Team Player: Has Collaborated in Many Projects",
  "Project Architect: Projects Are Cloned By Other Users A Lot",
  "Badge Hunter: Has A Lot of Badges",
];


function Badges({badges}) {
  return (
<>
      {badges.map((badge, index) => (
        <Tooltip title={badgeDescriptions[index]}>
          <Avatar
            src={`${window.location.origin}/badges/${badge}.svg`}
            sx={{
              height: 120,
              width: 120,
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

export default Badges;
