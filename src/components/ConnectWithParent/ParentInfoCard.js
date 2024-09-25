import React from "react";
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

// Utility function and tagColorMap as previously defined

const parentInfo={
    id: "",
    username: "Bro",
    name: "Bro",
    email: "Bro@bro.com",
    age: "69",
    photo: "avatar_1",
    childIds: [],
    pendingRequests: []
}

function ParentInfoCard({parent}) {
  const { userID } = useParams();

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
          {/* <Tooltip title="View Profile"> */}
              <CardMedia
                component="img"
                image={`${window.location.origin}/parent_avatars/parent_avatars_list/${parent.photo}.svg`}
                alt={`${parent.username}'s profile`}
                sx={{ width: 100, height: 100, borderRadius: "50%" }}
              />
          {/* </Tooltip> */}
          {/* <Tooltip title="View Profile"> */}
              <Typography
                variant="h6"
                fontFamily={TITLE}
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {`${parent.name} (${parent.username})`}
              </Typography>

          {/* </Tooltip> */}
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

          <Typography variant="body1" fontFamily={CONTENT} sx={{ mt: 1 }}>
            {parent.email}
          </Typography>
        </Box>
      </div>
    </Card>
  );
}

export default ParentInfoCard;
