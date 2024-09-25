import React from "react";
import { useNavigate, useParams } from "react-router-dom";

//MUI
import { Paper, Typography, List, ListItem } from "@mui/material";

//components
import ProjectCard from "../ExploreProjectsPage/ProjectCard";
import ScrollDownButton from "../misc/ScrollDownButton";
import Loading from "../misc/Loading";
import CustomRoundedButton from "../misc/CustomRoundedButton";

//import values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

function ProjectContainer({
  projects,
  scroll_id,
  title,
  height,
  own = false,
  cloned = false,
  collaborating = false,
}) {
  const navigate = useNavigate();

  const { userID } = useParams();
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
        {projects ? (
          projects.length > 0 ? (
            <List>
              {projects.map((project, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ProjectCard project={project} own={own} />
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
                padding: 10,
              }}
            >
              <Typography
                fontFamily={CONTENT}
                fontSize={40}
                sx={{ whiteSpace: "pre-line" }}
              >
                {" "}
                {collaborating
                  ? "You are currently not\ncollaborating in any project"
                  : cloned
                  ? "You have not cloned\nany projects yet"
                  : own
                  ? "No projects to show"
                  : "No projects found"}
              </Typography>
              {own && !collaborating && !cloned && (
                <CustomRoundedButton
                  textColor={textColor}
                  textColorOnHover={textColorOnHover}
                  backgroundColor={buttonBackgroundColor}
                  backgroundColorOnHover={buttonBackgroundColorOnHover}
                  borderRadius={buttonBorderRadius}
                  label="CREATE A PROJECT"
                  handleClick={() => {
                    navigate(`/kids/${userID}/codeEditor`, { replace: true });
                  }}
                />
              )}
              {cloned && (
                <CustomRoundedButton
                  textColor={textColor}
                  textColorOnHover={textColorOnHover}
                  backgroundColor={buttonBackgroundColor}
                  backgroundColorOnHover={buttonBackgroundColorOnHover}
                  borderRadius={buttonBorderRadius}
                  label="EXPLORE PROJECTS"
                  handleClick={() => {
                    navigate(`/kids/${userID}/exploreProjects`, { replace: true });
                  }}
                />
              )}
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
      {projects && projects.length > 0 && (
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

export default ProjectContainer;
