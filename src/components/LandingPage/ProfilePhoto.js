import React from "react";

//MUI
import { Box, Button, Avatar } from "@mui/material";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import ScrollDownButton from "../misc/ScrollDownButton";

import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

function ProfilePhoto({ handleBack, photo, setPhoto, handleSubmitAll }) {
  const photos = [
    "avatar_1",
    "avatar_2",
    "avatar_3",
    "avatar_4",
    "avatar_5",
    "avatar_6",
    "avatar_7",
    "avatar_8",
    "avatar_9",
    "avatar_10",
    "avatar_11",
    "avatar_12",
    "avatar_13",
    "avatar_14",
    "avatar_15",
    "avatar_16",
    "avatar_17",
    "avatar_18",
    "avatar_19",
    "avatar_20",
    "avatar_21",
    "avatar_22",
    "avatar_23",
    "avatar_24",
    "avatar_25",
    "avatar_26",
    "avatar_27",
    "avatar_28",
    "avatar_29",
    "avatar_30",
    "avatar_31",
    "avatar_32",
    "avatar_33",
    "avatar_34",
    "avatar_35",
    "avatar_36",
    "avatar_37",
    "avatar_38",
  ];

  const handleSelect = (selectedPhoto) => {
    setPhoto(selectedPhoto);
  };

  const handleContinueClick = () => {
    handleSubmitAll();
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
        Avatars{"   "}
        {/* <img
            src="/Interests/interest_title.gif"
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          /> */}
      </Box>

      <div style={{ position: "relative" }}>
        <Box
          id="photo-list-container"
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
          {photos.map((p) => (
            <Button
              //key={topic.name}
              onClick={() => handleSelect(p)}
              sx={{
                flexDirection: "column",
                width: 170,
                height: 170,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                color: "#334B71",
                backgroundColor: photo && photo === p ? "#334B71" : "#f7f7eb",
                border:
                  photo && photo === p
                    ? "10px solid rgb(173, 227, 159)"
                    : "3px solid #c4e3bc",
                "&:hover": {
                  backgroundColor: photo && photo === p ? "#dffcd9" : "#fcfccc",
                  color: photo && photo === p ? "white" : "#334B71",
                },
              }}
            >
              <Avatar
                src={`/avatars/avatars_list/${p}.svg`}
                sx={{
                  width: 130,
                  height: 130,
                  mb: 1,
                  border: "1px solid black",
                  backgroundColor: "white",
                }}
              />
            </Button>
          ))}
        </Box>
        <ScrollDownButton
          id="photo-list-container"
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
          justifyContent: "space-between",
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
          label="Back"
          //disabled={photo === null}
          handleClick={() => {
            handleBack();
          }}
        />
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Continue"
          disabled={photo === null}
          handleClick={handleContinueClick}
        />
      </Box>
    </div>
  );
}

export default ProfilePhoto;
