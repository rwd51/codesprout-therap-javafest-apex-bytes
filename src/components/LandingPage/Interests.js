import React, { useState, useEffect } from "react";

//MUI
import { Box, Typography, Button, Avatar } from "@mui/material";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import ScrollDownButton from "../misc/ScrollDownButton";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

function Interests({ handleNext, selectedTopics, setSelectedTopics }) {
  const topics = [
    { name: "Games", image: "/Interests/interests_list/games.svg" },
    { name: "Stories", image: "/Interests/interests_list/stories.svg" },
    { name: "Music", image: "/Interests/interests_list/music.svg" },
    { name: "Cooking", image: "/Interests/interests_list/cooking.svg" },
    { name: "Space", image: "/Interests/interests_list/space.svg" },
    { name: "Aliens", image: "/Interests/interests_list/aliens.svg" },
    { name: "Puzzles", image: "/Interests/interests_list/puzzles.svg" },
    { name: "Mystery", image: "/Interests/interests_list/mystery.svg" },
    { name: "Adventure", image: "/Interests/interests_list/adventure.svg" },
    { name: "Pirates", image: "/Interests/interests_list/pirates.svg" },
    { name: "Sports", image: "/Interests/interests_list/sports.svg" },
    { name: "Magic", image: "/Interests/interests_list/magic.svg" },
    { name: "Drawing", image: "/Interests/interests_list/drawing.svg" },
    { name: "Science", image: "/Interests/interests_list/science.svg" },
    { name: "Maths", image: "/Interests/interests_list/maths.svg" },
    {
      name: "Animals and Nature",
      image: "/Interests/interests_list/animals_and_nature.svg",
    },
    { name: "Dinosaurs", image: "/Interests/interests_list/dinosaurs.svg" },
    {
      name: "Underwater Adventures",
      image: "/Interests/interests_list/underwater_adventures.svg",
    },
    {
      name: "Ancient History",
      image: "/Interests/interests_list/ancient_history.svg",
    },
    { name: "Superheroes", image: "/Interests/interests_list/superheroes.svg" },
  ];

  const handleSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleContinueClick = () => {
    handleNext();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "60%",
        borderRadius: "20px",
        overflow: "hidden",
        border: "5px solid black",
      }}
    >
      <Box
        sx={{
          fontFamily: "Impact",
          fontSize: "40px",
          fontWeight: "bold",
          border: "2px solid black",
          display: "flex", // Enables flexbox
          alignItems: "center", // Centers items vertically within the container
          justifyContent: "center", // Optionally center items horizontally
          backgroundColor: "#fffff2",
          "&:hover": {
            backgroundColor: "#fcfcdc",
          },
        }}
      >
        What Do You Like{"   "}
        <img
          src="/Interests/interest_title.gif"
          alt="Logo"
          style={{ width: "100px", height: "100px" }}
        />
      </Box>

      <div style={{ position: "relative" }}>
        <Box
          id="interest-list-container"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            p: 2,
            border: "2px solid black",
            height: "400px",
            overflowY: "auto",
            backgroundColor: "#f2fafc",
            "&:hover": {
              backgroundColor: "#e8f5fa",
            },
          }}
        >
          {topics.map((topic) => (
            <Button
              key={topic.name}
              onClick={() => handleSelect(topic.name)}
              sx={{
                flexDirection: "column",
                width: 170,
                height: 170,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                color: selectedTopics.includes(topic.name)
                  ? "white"
                  : "#334B71",
                backgroundColor: selectedTopics.includes(topic.name)
                  ? "#334B71"
                  : "#f7f7eb",
                border: selectedTopics.includes(topic.name)
                  ? "10px solid rgb(173, 227, 159)"
                  : "3px solid #c4e3bc",
                "&:hover": {
                  backgroundColor: selectedTopics.includes(topic.name)
                    ? "#dffcd9"
                    : "#fcfccc",
                  color: "#334B71",
                },
              }}
            >
              <Avatar
                src={topic.image}
                sx={{
                  width: 90,
                  height: 90,
                  mb: 1,
                  border: "1px solid black",
                  backgroundColor: "white",
                }}
              />
              <Typography
                variant="caption"
                fontFamily={CONTENT}
                fontWeight="bold"
              >
                {topic.name}
              </Typography>
            </Button>
          ))}
        </Box>
        <ScrollDownButton
          id="interest-list-container"
          tooltipLabel="Scroll Down"
          iconColor="#334B71"
          iconBackgroundColor="#93db81"
          iconColorOnHover="white"
          iconBackgroundColorOnHover="#334B71"
        />
      </div>
      <Box
        sx={{
          display: "flex",
          border: "2px solid black",
          justifyContent: "flex-end",
          padding: "10px",
          backgroundColor: "#fffff2",
          "&:hover": {
            backgroundColor: "#fcfcdc",
          },
        }}
      >
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Continue"
          disabled={selectedTopics.length < 1}
          handleClick={handleContinueClick}
        />
      </Box>
    </div>
  );
}

export default Interests;
