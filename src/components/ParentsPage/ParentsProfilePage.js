import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//MUI
import { List, ListItem, Paper, Typography, Box, Grid } from "@mui/material";

//component
import UserInfoCard from "../ExploreProjectsPage/UserInfoCard";
import ScrollDownButton from "../misc/ScrollDownButton";
import Loading from "../misc/Loading";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import { PARENT_SERVICE_URI } from "../../env";

const users = [
  {
    id: "66c8716c3b2f15380a5f6c57",
    username: "rwd01",
    name: "Ruwad Naswan",
    email: "ruwad45678@gmail.com",
    age: 10,
    photo: "avatar_1",
    bio: "I love coding and solving puzzles!",
    topicInterests: ["Games", "Logic", "Puzzle"],
    badges: [],
    tag: "NewBie",
  },
  {
    id: "66c8716c3b2f15380a5f6c57",
    username: "rwd02",
    name: "John Doe",
    email: "johndoe@gmail.com",
    age: 12,
    photo: "avatar_2",
    bio: "Learning web development!",
    topicInterests: ["Games", "Logic", "Puzzle"],
    badges: [],
    tag: "Intermediate",
  },
  // Add more users as needed
];

const pending = [
  {
    childId: "66dac227aca56365d22ed637",
    username: "john_doe",
    name: "John Doe",
    photo: "https://example.com/photos/john_doe.jpg",
    topicInterests: [],
    badges: [],
    tag: "NewBie",
    bio: "Learning web development!",
  },
  {
    childId: "66dac227aca56365d22ed637",
    username: "john_doe",
    name: "John Doe",
    photo: "https://example.com/photos/john_doe.jpg",
    topicInterests: [],
    badges: [],
    tag: "NewBie",
    bio: "Learning web development!",
  },
];

//fetching all children
const fetchAllChildrenInfo = async (parentID) => {
  try {
    const res = await fetch(
      `${PARENT_SERVICE_URI}/${parentID}/allChildren/info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

//fetching all pending requests
const fetchPendingRequests = async (parentID) => {
  try {
    const res = await fetch(
      `${PARENT_SERVICE_URI}/getPendingRequests?parentId=${parentID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};


function ParentsProfilePage() {
  const { userID } = useParams();

  const [allChildrenInfo, setAllChildrenInfo] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchAllChildrenInfo(userID)
      .then((allChildren) => {
        console.log(allChildren);

        setAllChildrenInfo(allChildren);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchPendingRequests(userID)
      .then((requests) => {
        console.log(requests);

        setPendingRequests(requests)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);
  return (
    <Grid container>
      <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={`${window.location.origin}/ParentProfile/child.gif`}/>
      </Grid>
      <Grid item xs={6}>
        <Paper
          elevation={3}
          sx={{
            height: "80vh",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#fff8c7",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontWeight="bold"
              gutterBottom
            >
              Kids
            </Typography>
          </Box>
          <div
            id="collaborators-container"
            style={{
              flexGrow: 1,
              overflowY: "auto",
              backgroundColor: "rgb(245, 245, 240,0.5)",
            }}
          >
            {allChildrenInfo ? (
              allChildrenInfo.length > 0 ? (
                <List>
                  {allChildrenInfo.map((user, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <UserInfoCard user={user} />
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
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontFamily={CONTENT} fontSize={30}>
                    {" "}
                    Currently you are not assigned
                  </Typography>
                  <Typography fontFamily={CONTENT} fontSize={30}>
                    as a parent of any user
                  </Typography>
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  height: '100%',
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
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
          {allChildrenInfo && allChildrenInfo.length > 0 && (
            <ScrollDownButton
              id="kids-info-container"
              tooltipLabel="Scroll Down"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
            />
          )}
        </Paper>
      </Grid>
      <Grid item xs={6} sx={{ mt: 10, mb: 10 }}>
        <Paper
          elevation={3}
          sx={{
            height: "80vh",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#fff8c7",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontWeight="bold"
              gutterBottom
            >
              Pending Requests
            </Typography>
          </Box>
          <div
            id="collaborators-container"
            style={{
              flexGrow: 1,
              overflowY: "auto",
              backgroundColor: "rgb(245, 245, 240,0.5)",
            }}
          >
            {pendingRequests ? (
              pendingRequests.length > 0 ? (
                <List>
                  {pendingRequests.map((user, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <UserInfoCard user={user} parent={true} />
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
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontFamily={CONTENT} fontSize={30}>
                    {" "}
                    No Pending Requests
                  </Typography>
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  height: '100%',
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
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
          {pendingRequests && pendingRequests.length > 0 && (
            <ScrollDownButton
              id="kids-info-container"
              tooltipLabel="Scroll Down"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
            />
          )}
        </Paper>
      </Grid>
      <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={`${window.location.origin}/ParentProfile/clock.gif`}/>
      </Grid>
    </Grid>
  );
}

export default ParentsProfilePage;
