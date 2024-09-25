import React, { useState, useEffect } from "react";

//MUI
import { Card, CardContent, IconButton, Typography, Box } from "@mui/material";

//imporing lodash
import _ from "lodash";

//icons
import DeleteIcon from "@mui/icons-material/Delete";

//components
import Loading from "../../../../misc/Loading";

//firebase
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../../../../firebase-config";

function SpriteCard({
  sprite,
  cardWidth,
  cardHeight,
  selectionArray = false,
  selectedSprite,
  setSelectedSprite,
  setDummySelectedSprite, //no need to pass in setDummySelectedSprite if its a selection array
  handleSetActive, //no need to pass in handleSetActive if its a selection array
  handleDelete, //no need to pass in handleDelete if its a selection array
}) {

  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await getDownloadURL(
          ref(storage, `sprites/${sprite.imgSrc}`)
        );
        setImgUrl(url);
      } catch (error) {
        console.error("Error fetching sprite image from Firebase:", error);
      }
    };

    fetchImageUrl();
  }, [sprite.imgSrc]);

  if (!imgUrl) {
    return (
      <Card style={{ width: cardWidth, height: cardHeight }}>
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%", // Ensure the CardContent takes the full height of the Card
            padding: 0, // Remove padding
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loading
              sprinnerWidth={`${cardWidth*0.8}px`}
              spinnerHeight={`${cardWidth*0.8}px`}
              spinnerColor="#334B71"
              spinnerBackgroundColor="#ebfdff"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onMouseOver={(e) => {
        if (!_.isEqual(selectedSprite, sprite)) {
          e.currentTarget.style.backgroundColor = "#f0f0f0";
          e.currentTarget.style.outline = "2px solid #6200ea";
        } else {
          e.currentTarget.style.outline = "5px solid #9a8db5";
        }
      }}
      onMouseOut={(e) => {
        if (!_.isEqual(selectedSprite, sprite)) {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.outline = "none";
        } else {
          e.currentTarget.style.outline = "2px solid #3700b3";
        }
      }}
      style={{
        border: _.isEqual(selectedSprite, sprite)
          ? "2px solid #3700b3"
          : "none",
        cursor: "pointer",
        position: "relative",
        borderRadius: "10px", // Rounded edges for the sprite photos
        transition: "background-color 0.3s, outline 0.3s",
        backgroundColor: _.isEqual(selectedSprite, sprite)
          ? "#f0f0f0"
          : "white",
        outline: _.isEqual(selectedSprite, sprite)
          ? "2px solid #3700b3"
          : "none",
        width: `${cardWidth}px`, // Set minimum width for each card
        height: `${cardHeight}px`, // Set fixed height for the card
      }}
      onClick={() => {
        setSelectedSprite(sprite);
        if (!selectionArray) setDummySelectedSprite(sprite);
        if (!selectionArray) handleSetActive(sprite.id, sprite.type);
      }}
    >
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%", // Ensure the CardContent takes the full height of the Card
          padding: 0, // Remove padding
        }}
      >
        <div
          style={{
            height: "75%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imgUrl}
            alt={sprite.name}
            style={{
              borderRadius: "10px",
              maxHeight: "100%",
              maxWidth: "100%",
            }} // Adjust the image size to fit within the div
          />
        </div>
        {!selectionArray && _.isEqual(selectedSprite, sprite) && (
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "black",
              width: "25px",
              height: "25px",
              backgroundColor: "#9f7bd1",
              "&:hover": {
                backgroundColor: "darkred",
                color: "white",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(sprite);
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <Box
          sx={{
            backgroundColor: _.isEqual(selectedSprite, sprite)
              ? "#6200ea"
              : "#e1dce8",
            height: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            "&:hover": {
              backgroundColor: "#c7aeeb",
            },
          }}
        >
          <Typography
            sx={{
              color: _.isEqual(selectedSprite, sprite) ? "white" : "black",
              borderRadius: "5px",
              padding: "0.2rem",
              textAlign: "center",
              whiteSpace: "nowrap", // Prevents text from wrapping
              overflow: "hidden", // Ensures overflow content is hidden
              textOverflow: "ellipsis", // Adds ellipsis for overflowing text
              width: "100%", // Ensure the text occupies the full width of the div
              textAlign: "center", // Center the text
            }}
          >
            {sprite.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SpriteCard;
