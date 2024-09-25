import React from "react";

//MUI
import { Paper, Typography, List, ListItem } from "@mui/material";

//components
import ProblemCard from "./ProblemCard";
import CustomRoundedButton from "../misc/CustomRoundedButton";
import ScrollDownButton from "../misc/ScrollDownButton";
import Loading from "../misc/Loading";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";



function ProblemContainer({ problems, title, scroll_id, height }) {
  return (
    <Paper
      elevation={3}
      sx={{
        height: height,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        fontFamily={TITLE}
        fontWeight="bold"
        gutterBottom
        sx={{
          p: 3,
          backgroundColor: "#f7f6e9",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {title}
      </Typography>
      <div
        id={scroll_id}
        style={{
          flexGrow: 1,
          overflowY: "auto",
          backgroundColor: "rgb(245, 245, 240,0.5)",
        }}
      >
        {problems ? (
          <List>
            {problems.map((problem, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ProblemCard problem={problem} />
              </ListItem>
            ))}
          </List>
        ) : (
          <div
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loading
              spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
              sprinnerWidth="250px"
              spinnerHeight="250px"
              spinnerImageWidth="200px"
              spinnerImageHeight="200px"
              spinnerColor="#334B71"
              spinnerBackgroundColor="#ebfdff"
            />
          </div>
        )}
      </div>
      {problems && problems.length > 0 && (
        <ScrollDownButton
          id={scroll_id}
          tooltipLabel="Scroll Down"
          iconColor="#334B71"
          iconBackgroundColor="#93db81"
          iconColorOnHover="white"
          iconBackgroundColorOnHover="#334B71"
          //left="50%"
        />
      )}
    </Paper>
  );
}

export default ProblemContainer;
