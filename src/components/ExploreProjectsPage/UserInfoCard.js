import React, { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

//MUI
import {
  Box,
  Typography,
  Chip,
  Link,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  CircularProgress,
} from "@mui/material";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";
import { PARENT_SERVICE_URI } from "../../env";

// Utility function and tagColorMap as previously defined
const tagColorMap = new Map();

function getColorForTag(tag) {
  if (tagColorMap.has(tag)) {
    return tagColorMap.get(tag);
  }

  const random = Math.random();
  const randomColor = `hsl(${random * 360}, 70%, 50%)`;
  const lessOpaqueColor = `hsla(${random * 360}, 70%, 50%, 0.2)`;
  const colors = { text: randomColor, background: lessOpaqueColor };

  tagColorMap.set(tag, colors);
  return colors;
}

//accepting requests
const handleAcceptRequest = async (
  parentID,
  childID,
  setIsAcceptingRequest
) => {
  try {
    setIsAcceptingRequest(true);
    const res = await fetch(
      `${PARENT_SERVICE_URI}/${parentID}/approve/${childID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        //body: JSON.stringify({})
      }
    );

    //const parseRes = await res.json();
    if (res.ok) {
    } else {
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    setIsAcceptingRequest(false);
  }
};

function UserInfoCard({ user, parent = false }) {
  const { userID } = useParams();

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);

  return (
    <Card
      sx={{
        // display: "flex",
        // justifyContent: "space-between",
        // alignItems: "center",
        width: "100%",
        borderRadius: "20px",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          borderRadius: "20px",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tooltip title="View Profile">
            <Link
              component={RouterLink}
              to={
                userID === user.id
                  ? `/kids/${userID}/profile`
                  : `/kids/${userID}/profile/${user.id}`
              }
            >
              <CardMedia
                component="img"
                image={`${window.location.origin}/avatars/avatars_list/${user.photo}.svg`}
                alt={`${user.username}'s profile`}
                sx={{ width: 100, height: 100, borderRadius: "50%" }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="View Profile">
            <Link
              component={RouterLink}
              to={
                userID === user.id
                  ? `/kids/${userID}/profile`
                  : `/kids/${userID}/profile/${user.id}`
              }
              color="inherit"
              underline="hover"
            >
              <Typography
                variant="h6"
                fontFamily={TITLE}
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {`${user.name} (${user.username})`}
              </Typography>
            </Link>
          </Tooltip>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              alignSelf: "flex-end",
              bgcolor: "lightgray",
              px: 2,
              py: 1,
              borderRadius: "10px",
              transition: "all 0.3s ease", // Smooth transition for hover effects
              "&:hover": {
                bgcolor: "darkgray", // Background color on hover
                color: "white", // Text color on hover
              },
            }}
          >
            {user.tag}
          </Typography>

          <Typography variant="body1" fontFamily={CONTENT} sx={{ mt: 1 }}>
            {user.bio}
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
            {user.topicInterests && user.topicInterests.map((interest, index) => {
              const colors = getColorForTag(interest);
              return (
                <Chip
                  key={index}
                  label={interest}
                  sx={{
                    mr: 1,
                    mb: 1,
                    color: colors.text,
                    backgroundColor: colors.background,
                    "&:hover": {
                      color: "white",
                      backgroundColor: colors.text,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </div>
      {parent && (
        <div style={{ alignSelf: "flex-end" }}>
          <CustomRoundedButton
            textColor={textColor}
            textColorOnHover={textColorOnHover}
            backgroundColor={
              isAcceptingRequest ? "black" : buttonBackgroundColor
            }
            backgroundColorOnHover={buttonBackgroundColorOnHover}
            borderRadius={buttonBorderRadius}
            label={
              <div style={{ minWidth: 100 }}>
                {isAcceptingRequest ? (
                  <CircularProgress
                    size={20}
                    thickness={40} // Thicker arc (default is 3.6)
                    style={{ color: "white" }}
                  />
                ) : (
                  "ACCEPT"
                )}
              </div>
            }
            disabled={isAcceptingRequest}
            handleClick={() => {
              handleAcceptRequest(userID, user.childId, setIsAcceptingRequest);
            }}
          />
        </div>
      )}
    </Card>
  );
}

export default UserInfoCard;
