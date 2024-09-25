import React from "react";

//MUI
import { Paper, Typography, List, ListItem } from "@mui/material";

//components
import ParentInfoCard from "./ParentInfoCard";
import Loading from "../misc/Loading";
import ScrollDownButton from "../misc/ScrollDownButton";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";

function ParentInfoContainer({
  title,
  height,
  scroll_id,
  parents,
  request = false,
}) {
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
        {parents ? (
          parents.length > 0 ? (
            <List>
              {parents.map((parent, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ParentInfoCard parent={parent} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontFamily={CONTENT} fontSize={40}>
                {" "}
                {request ? "No Pending Requests" : "No Parents Assigned"}
              </Typography>
            </div>
          )
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
      {parents && parents.length > 0 && (
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

export default ParentInfoContainer;
