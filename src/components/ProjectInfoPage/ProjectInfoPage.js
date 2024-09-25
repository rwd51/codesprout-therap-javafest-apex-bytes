import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

//MUI
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Chip,
  List,
  ListItem,
  Link,
  Rating,
} from "@mui/material";

//chart js
import { Doughnut } from "react-chartjs-2";
import {
  Chart as Chart,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import UserInfoCard from "../ExploreProjectsPage/UserInfoCard";
import ScrollDownButton from "../misc/ScrollDownButton";
import ProjectContainer from "../YourProjectsPage/ProjectContainer";
import Loading from "../misc/Loading";

//icons
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

//URI
import { PROJECT_SERVICE_URI, USER_SERVICE_URI } from "../../env";

//firebase
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import storage from "../../firebase-config";

Chart.register(ArcElement, ChartTooltip, Legend);

// Utility function to generate color and its less opaque version
const tagColorMap = new Map(); // Cache to store colors for tags

function getColorForTag(tag) {
  if (tagColorMap.has(tag)) {
    return tagColorMap.get(tag);
  }

  // Generate a random color
  const random = Math.random();
  const randomColor = `hsl(${random * 360}, 70%, 50%)`;
  const lessOpaqueColor = `hsla(${random * 360}, 70%, 50%, 0.2)`;
  const colors = { text: randomColor, background: lessOpaqueColor };

  // Store in map
  tagColorMap.set(tag, colors);
  return colors;
}

//function to fetch the details of a particular project
const fetchProjectDetails = async (projectID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}?id=${projectID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        //'token': localStorage.token
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

//function to fetch details of a particular user
const fetchUserDetails = async (userID) => {
  try {
    const res = await fetch(`${USER_SERVICE_URI}/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

//fetching the project photo from firebase
async function getImageUrl(fileName) {
  const imageRef = ref(storage, `projects/covers/${fileName}.png`);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    throw error;
  }
}

//duplicating a file in firebase
const duplicateFileInFirebase = async (originalFileName, newFileName) => {
  try {
    //Reference of original file
    const originalFileRef = ref(
      storage,
      `projects/covers/${originalFileName}.png`
    );

    //Download original file as a Blob
    const originalFileUrl = await getDownloadURL(originalFileRef);
    const response = await fetch(originalFileUrl);
    const fileBlob = await response.blob();

    //Upload Blob under new name
    const newFileRef = ref(storage, `projects/covers/${newFileName}.png`);
    await uploadBytes(newFileRef, fileBlob);

    console.log(`File duplicated successfully: ${newFileName}.png`);
  } catch (error) {
    console.error("Error duplicating file:", error);
  }
};

//handling project clone
const handleCloneProject = async (userDetails, project) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/clone/${userDetails.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({
        projectId: project.projectId,
        projectName: `${project.projectName}-cloned-${userDetails.username}`,
        description: `${project.description}-(cloned)`,
        userId: userDetails.id,
        clonedUserIds: [],
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        tags: project.tags,
        public: false,
        collaborators: [],
        midAreaLists: project.midAreaLists,
        characters: project.characters,
        active: project.active,
        ratings: {},
      }),
    });

    const parseRes = await res.json();

    if (res.ok) {
      return duplicateFileInFirebase(project.projectId, parseRes.projectId)
        .then(() => {
          return parseRes;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  }
};

const fetchClonedUserDetails = async (userIDs) => {
  const uniqueUserIDs = [...new Set(userIDs)];

  const clonedUserDetails = await Promise.all(
    uniqueUserIDs.map((userID) => fetchUserDetails(userID))
  );

  return clonedUserDetails;
};

const fetchCloneStats = async (projectID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/${projectID}/clone/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();

    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error("Failed to fetch score:", err.message);
  }
};

const rateProject = async (project, userID, rating) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description,
        userId: project.userId,
        clonedUserIds: project.clonedUserIds,
        creationDate: project.creationDate,
        lastUpdateDate: project.lastUpdateDate,
        tags: project.tags,
        public: project.public,
        collaborators: project.collaborators,
        midAreaLists: project.midAreaLists,
        characters: project.characters,
        active: project.active,
        ratings: { ...project.ratings, [userID]: rating },
      }),
    });

    const parseRes = await res.json();

    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  }
};

//utils
function calculateAverage(map) {
  if (Object.keys(map).length === 0) return 0;
  const values = Object.values(map);
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function getValueOrDefault(map, key) {
  return map.hasOwnProperty(key) ? map[key] : null;
}

function ProjectInfoPage() {
  //using navigation
  const navigate = useNavigate();

  //handling opening project in editor
  const openProjectInEditor = (userID, projectID) => {
    navigate(`/kids/${userID}/codeEditor/${projectID}/null`, { replace: true });
  };

  //fetching stuff
  const { userID, projectID } = useParams();
  const [project, setProject] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [collaboratorDetails, setCollaboratorDetails] = useState(null);
  const [clonedUserDetails, setClonedUserDetails] = useState(null);
  const [projectCoverURL, setProjectCoverURL] = useState(null);

  //clone stats
  const [cloneStats, setCloneStats] = useState(null);

  //ratings state
  const [ratings, setRatings] = useState(null);
  const [isRatingsHovered, setIsRatingsHovered] = useState(false);
  const [isRatingDonutHovered, setIsRatingDonutHovered] = useState(false);
  const [isCloneDonutHovered, setIsCloneDonutHovered] = useState(false);

  useEffect(() => {
    fetchUserDetails(userID)
      .then((user) => setCurrentUserDetails(user))
      .catch((err) => {
        console.log(err);
      });

    fetchProjectDetails(projectID)
      .then((proj) => {
        console.log(proj);
        setProject(proj);

        if (userID === proj.userId) {
          setRatings(calculateAverage(proj.ratings));
        } else {
          setRatings(proj.ratings[userID] ? proj.ratings[userID] : 0);
        }

        fetchUserDetails(proj.userId)
          .then((user) => setUserDetails(user))
          .catch((err) => console.log(err));

        const fetchAllCollaborators = async () => {
          try {
            const collaborators = await Promise.all(
              proj.collaborators.map((collaboratorID) =>
                fetchUserDetails(collaboratorID)
              )
            );
            setCollaboratorDetails(collaborators);
          } catch (err) {
            console.log(err);
          }
        };
        fetchAllCollaborators();

        fetchClonedUserDetails(proj.clonedUserIds)
          .then((userDetails) => {
            setClonedUserDetails(userDetails);
            console.log(userDetails);
          })
          .catch((err) => console.log(err));

        getImageUrl(proj.projectId)
          .then((url) => setProjectCoverURL(url))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    fetchCloneStats(projectID)
      .then((stats) => {
        setCloneStats(stats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, projectID);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  const chartDataForClones = {
    labels: [],
    datasets: [
      {
        data: [
          [...new Set(project?.clonedUserIds)].length ?? 0,
          project?.clonedUserIds.length ??
            project?.clonedUserIds.length -
              [...new Set(project?.clonedUserIds)].length ??
            0,
        ],
        backgroundColor: [
          isCloneDonutHovered ? "#00ff00" : "#77d990", // Change color based on hover state
          isCloneDonutHovered ? "black" : "#E0E0E0",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  //barchart
  const [isBarChartHovered, setIsBarChartHovered] = useState(false);

  const barChartData = {
    labels: cloneStats ? Object.keys(cloneStats).reverse() : [],
    datasets: [
      {
        label: "Clone Statistics",
        data: cloneStats ? Object.values(cloneStats).reverse() : [],
        backgroundColor: isBarChartHovered
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(75, 192, 192, 0.2)", // Changes on hover
        borderColor: isBarChartHovered
          ? "rgba(255, 255, 255, 1)"
          : "rgba(75, 192, 192, 1)", // Changes on hover
        borderWidth: 3, // Changes on hover
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isBarChartHovered ? "white" : "black", // Change Y-axis label color on hover
          stepSize: 1,
          callback: function (value) {
            if (Math.floor(value) === value) {
              return value;
            }
          },
        },
        grid: {
          color: isBarChartHovered
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.3)", // Change Y-axis grid color on hover
        },
      },
      x: {
        ticks: {
          color: isBarChartHovered ? "white" : "black", // Change X-axis label color on hover
        },
        grid: {
          color: isBarChartHovered
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.3)", // Change X-axis grid color on hover
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isBarChartHovered ? "white" : "black", // Change legend label color on hover
        },
      },
    },
  };

  function BarChart({ barChartData, barChartOptions }) {
    return <Bar data={barChartData} options={barChartOptions} />;
  }

  const chartDataForRating = {
    labels: [],
    datasets: [
      {
        data: project
          ? [
              calculateAverage(project.ratings),
              5 - calculateAverage(project.ratings),
            ]
          : [0, 5],
        backgroundColor: [
          isRatingDonutHovered ? "yellow" : "#fa4d4d", //334B71
          isRatingDonutHovered ? "black" : "#E0E0E0",
        ],
        borderWidth: 0,
      },
    ],
  };
  function RatingChart({ chartDataForRating, chartOptions, rating }) {
    return (
      <Box
        sx={{
          position: "relative",
          height: "300px",
          width: "100%",
          margin: "auto",
          p: 2,
        }}
      >
        <Doughnut data={chartDataForRating} options={chartOptions} />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontSize: "50px",
            fontFamily: CONTENT,
            fontWeight: "bold",
          }}
        >
          {rating}
        </Box>
      </Box>
    );
  }

  function CloneChart({ chartDataForClones, chartOptions, cloneCount }) {
    return (
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          margin: "auto",
          p: 2,
        }}
      >
        <Doughnut data={chartDataForClones} options={chartOptions} />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontSize: "50px",
            fontFamily: CONTENT,
            fontWeight: "bold",
          }}
        >
          {cloneCount}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        px: 3,
        bgcolor: "#e8fce3",
      }}
    >
      <Paper
        sx={{
          width: "80%",
          margin: "auto",
          overflow: "hidden",
          bgcolor: "#fcfaed",
        }}
      >
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {/* Photo Section */}
          <Grid item xs={12} sm={7}>
            {projectCoverURL ? (
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  backgroundImage: `url(${projectCoverURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "3px solid black",
                  borderRadius: "20px",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                  width: "100%",
                  backgroundColor: "white",
                  border: "3px solid black",
                  borderRadius: "20px",
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
          </Grid>

          {/* Description Section */}
          <Grid item xs={12} sm={5}>
            {!project ? (
              <div
                style={{
                  display: "flex",
                  height: 400,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading
                  //spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                  sprinnerWidth="200px"
                  spinnerHeight="200px"
                  spinnerImageWidth="150px"
                  spinnerImageHeight="150px"
                  spinnerColor="#334B71"
                  spinnerBackgroundColor="#ebfdff"
                />
              </div>
            ) : (
              <div style={{ height: 400, position: "relative" }}>
                <Typography
                  variant="h3"
                  gutterBottom
                  fontFamily={TITLE}
                  fontWeight="bold"
                >
                  {project.projectName}
                </Typography>
                <Typography variant="body1" gutterBottom fontFamily={CONTENT}>
                  {project.description}
                </Typography>
                <Box sx={{ my: 1, position: "absolute", bottom: 0 }}>
                  {project.tags.map((tag, idx) => {
                    const colors = getColorForTag(tag);
                    return (
                      <Tooltip
                        key={idx}
                        title={`Tag: ${tag}`}
                        placement="top"
                        arrow
                        sx={{
                          tooltip: {
                            bgcolor: "black", // Custom background color
                          },
                        }}
                      >
                        <Chip
                          label={tag}
                          sx={{
                            mr: 1,
                            color: colors.text,
                            backgroundColor: colors.background,
                            "&:hover": {
                              color: "white",
                              backgroundColor: colors.text,
                            },
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </div>
            )}
          </Grid>
        </Grid>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: 15,
          }}
        >
          {project && (
            <CustomRoundedButton
              textColor={textColor}
              textColorOnHover={textColorOnHover}
              backgroundColor={buttonBackgroundColor}
              backgroundColorOnHover={buttonBackgroundColorOnHover}
              borderRadius={buttonBorderRadius}
              label={
                userID === project.userId ? "OPEN IN EDITOR" : "CLONE PROJECT"
              }
              handleClick={() =>
                userID === project.userId
                  ? openProjectInEditor(userID, project.projectId)
                  : handleCloneProject(currentUserDetails, project)
                      .then((proj) => {
                        navigate(
                          `/kids/${currentUserDetails.id}/codeEditor/${proj.projectId}/null`
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      })
              }
            />
          )}
        </div>
        <Grid container>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontSize={40}
              fontWeight="bold"
            >
              Contributors
            </Typography>
          </div>
          <Grid item xs={12} sm={6} sx={{ border: "2px solid black", mt: 5 }}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                bgcolor: "#fcfafa",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  //mt: 3,
                  mb: 3,
                  fontSize: 40,
                  fontWeight: "bold",
                  fontFamily: TITLE,
                }}
              >
                Owner
              </Typography>
              {!userDetails ? (
                <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
                  <Loading
                    spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                    sprinnerWidth="230px"
                    spinnerHeight="230px"
                    spinnerImageWidth="180px"
                    spinnerImageHeight="180px"
                    spinnerColor="#334B71"
                    spinnerBackgroundColor="#ebfdff"
                  />
                </div>
              ) : (
                <>
                  <Tooltip title="View Profile">
                    <Link
                      component={RouterLink}
                      to={
                        userID === userDetails.id
                          ? `/kids/${userID}/profile`
                          : `/kids/${userID}/profile/${userDetails.id}`
                      }
                      color="inherit"
                      underline="hover"
                    >
                      <Avatar
                        src={`${window.location.origin}/avatars/avatars_list/${userDetails.photo}.svg`}
                        sx={{ width: 120, height: 120, my: 2 }}
                      />{" "}
                    </Link>
                  </Tooltip>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 20,
                      fontFamily: CONTENT,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Tooltip title="View Profile">
                      <Link
                        component={RouterLink}
                        to={
                          userID === userDetails.id
                            ? `/kids/${userID}/profile`
                            : `/kids/${userID}/profile/${userDetails.id}`
                        }
                        color="inherit"
                        underline="hover"
                      >
                        {`${userDetails.name} (${userDetails.username})`}
                      </Link>
                    </Tooltip>

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
                      {userDetails.tag}
                    </Typography>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontSize: 20, fontFamily: CONTENT }}
                  >
                    {userDetails.bio}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 15, fontFamily: CONTENT, mb: 2 }}
                  >
                    {userDetails.email}
                  </Typography>
                  <Box sx={{ my: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 15,
                        fontFamily: CONTENT,
                        fontWeight: "bold",
                      }}
                    >
                      Interests:{" "}
                      {userDetails.topicInterests.map((tag, idx) => {
                        const colors = getColorForTag(tag);
                        return (
                          <Tooltip
                            key={idx}
                            title={`Tag: ${tag}`}
                            placement="top"
                            arrow
                            sx={{
                              tooltip: {
                                bgcolor: "black", // Custom background color
                              },
                            }}
                          >
                            <Chip
                              label={tag}
                              sx={{
                                mr: 1,
                                color: colors.text,
                                backgroundColor: colors.background,
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: colors.text,
                                },
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ border: "2px solid black", mt: 5 }}>
            <Paper
              elevation={3}
              sx={{
                height: "55vh",
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
                  Collaborators
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
                {collaboratorDetails ? (
                  collaboratorDetails.length > 0 ? (
                    <List>
                      {collaboratorDetails.map((user, index) => (
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
                        No collaborators
                      </Typography>
                      <Typography fontFamily={CONTENT} fontSize={30}>
                        in this project
                      </Typography>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      display: "flex",
                      //flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                    }}
                  >
                    <Loading
                      //spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
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
              {collaboratorDetails && collaboratorDetails.length > 0 && (
                <ScrollDownButton
                  id="collaborators-container"
                  tooltipLabel="Scroll Down"
                  iconColor="#334B71"
                  iconBackgroundColor="#93db81"
                  iconColorOnHover="white"
                  iconBackgroundColorOnHover="#334B71"
                />
              )}
            </Paper>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 10, border: "2px solid black" }}>
          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              //mb: 5,
              display: "flex",
              justifyContent: "center",
              bgcolor: "#aef2fc",
              "&:hover": {
                bgcolor: "black",
                color: "white",
              },
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontSize={40}
              fontWeight="bold"
            >
              Rating
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              //mb: 5,
              display: "flex",
              justifyContent: "center",
              bgcolor: "#8ff1ff",
              "&:hover": {
                bgcolor: "black",
                color: "white",
              },
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontSize={40}
              fontWeight="bold"
            >
              Rate the Project
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              //mb: 10,
              bgcolor: "#c7f6fc",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
            }}
            onMouseEnter={() => setIsRatingDonutHovered(true)}
            onMouseLeave={() => setIsRatingDonutHovered(false)}
          >
            {/* <Box
              sx={{
                position: "relative",
                height: "300px",
                width: "100%",
                margin: "auto",
                p: 2,
              }}
            >
              <Doughnut data={chartDataForRating} options={chartOptions} />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  fontSize: "50px",
                  fontFamily: CONTENT,
                  fontWeight: "bold",
                }}
              >
                {project.ratings}
              </Box>
            </Box> */}
            <RatingChart
              chartDataForRating={chartDataForRating}
              chartOptions={chartOptions}
              rating={project?.ratings ? calculateAverage(project.ratings) : 0}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              //mb: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: isRatingsHovered ? "#334B71" : "#def8fc",
              color: isRatingsHovered ? "white" : "inherit",
              "&:hover": {
                cursor: "pointer", // Optional: changes the cursor to pointer on hover
              },
            }}
            onMouseEnter={() => setIsRatingsHovered(true)}
            onMouseLeave={() => setIsRatingsHovered(false)}
          >
            <Rating
              name="project-rating"
              value={ratings} // Replace with your actual value or state
              precision={0.5}
              disabled={project && userID === project.userId}
              onChange={(event, newValue) => {
                // Handle the rating change
                console.log(`New Rating: ${newValue}`);
                setRatings(newValue);

                rateProject(project, userID, newValue)
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
              }}
              icon={
                <StarIcon
                  style={{
                    color: isRatingsHovered ? "yellow" : "#FFD700", // Change filled star color on hover
                    fontSize: 90,
                  }}
                />
              }
              emptyIcon={
                <StarBorderIcon
                  style={{
                    color: isRatingsHovered ? "white" : "#C0C0C0", // Change empty star color on hover
                    fontSize: 90,
                  }}
                />
              }
            />
          </Grid>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#aef2fc",
              "&:hover": {
                bgcolor: "black",
                color: "white",
              },
            }}
          >
            <Typography
              variant="h4"
              fontFamily={TITLE}
              fontSize={40}
              fontWeight="bold"
            >
              Clones
            </Typography>
          </Box>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              p: 5,
              bgcolor: "#def8fc",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
            }}
            onMouseEnter={() => setIsBarChartHovered(true)}
            onMouseLeave={() => setIsBarChartHovered(false)}
          >
            {cloneStats && (
              <BarChart
                barChartData={barChartData}
                barChartOptions={barChartOptions}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "#c4f8ff",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
            }}
            onMouseEnter={() => setIsCloneDonutHovered(true)}
            onMouseLeave={() => setIsCloneDonutHovered(false)}
          >
            {/* <Box
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                margin: "auto",
                p: 2,
              }}
            >
              <Doughnut data={chartDataForClones} options={chartOptions} />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  fontSize: "50px",
                  fontFamily: CONTENT,
                  fontWeight: "bold",
                }}
              >
                {project.ratings}
              </Box>
            </Box> */}
            {project && (
              <CloneChart
                chartDataForClones={chartDataForClones}
                chartOptions={chartOptions}
                cloneCount={project.clonedUserIds.length}
              />
            )}
          </Grid>
        </Grid>

        {/* Nested Comment System */}
        {/* <Grid item xs={12} sx={{ mt: 2, fontWeight: "bold", p: 5 }}>
          <Typography variant="h4" fontFamily={TITLE} fontWeight="bold">
            Reviews
          </Typography>
          <div style={{ maxHeight: "700px", overflowY: "auto" }}>
            {data.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </Grid> */}
        {/* <Grid item xs={12}>
          <ProjectContainer
            projects={projects}
            scroll_id={"projects-container"}
            title={"Similar Projects"}
            height={"90vh"}
          />
        </Grid> */}
        <Box
          sx={{
            border: "2px solid black",
            mt: 10,
            width: "100%",
            maxWidth: "100%",
            mb: 10,
          }}
        >
          <Box
            textAlign="center"
            sx={{
              backgroundColor: "#fff8c7",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
              },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography fontFamily={TITLE} fontWeight="bold" fontSize={40}>
              Users Who Cloned The Project
            </Typography>
          </Box>
          <Box
            sx={{
              border: "2px solid black",
              display: "flex",
              gap: "1rem",
              overflowX: "scroll",
              width: "100%",
              maxWidth: "100%",
              whiteSpace: "nowrap", // Ensure content doesn't wrap
              padding: 5,
              bgcolor: "#f0f0f0",
              "&:hover": {
                bgcolor: clonedUserDetails ? "#334B71" : "#f0f0f0",
                color: "white",
              },
            }}
          >
            {clonedUserDetails ? (
              clonedUserDetails.length > 0 ? (
                clonedUserDetails.map((collaborator, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    sx={{
                      borderRadius: "30px",
                      height: 200,
                      width: 200,
                      flex: "0 0 auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "1rem",
                      "&:hover": {
                        bgcolor: "#fff087",
                      },
                    }}
                  >
                    <Tooltip title="View Profile">
                      <Link
                        component={RouterLink}
                        to={
                          userID === collaborator.id
                            ? `/kids/${userID}/profile`
                            : `/kids/${userID}/profile/${collaborator.id}`
                        }
                        color="inherit"
                        underline="hover"
                      >
                        <Avatar
                          src={`${window.location.origin}/avatars/avatars_list/${collaborator.photo}.svg`}
                          sx={{ height: 100, width: 100 }}
                        />
                      </Link>
                    </Tooltip>
                    <Tooltip title="View Profile">
                      <Link
                        component={RouterLink}
                        to={
                          userID === collaborator.id
                            ? `/kids/${userID}/profile`
                            : `/kids/${userID}/profile/${collaborator.id}`
                        }
                        color="inherit"
                        underline="hover"
                      >
                        <Typography
                          fontFamily={CONTENT}
                          fontWeight="bold"
                          fontSize={20}
                        >
                          {collaborator.username}
                        </Typography>
                      </Link>
                    </Tooltip>
                  </Paper>
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontFamily={CONTENT}
                    fontSize={40}
                    sx={{
                      whiteSpace: "pre-line",
                      "&:hover": { color: "yellow" },
                    }}
                  >
                    No Users Have Cloned This Project Yet
                  </Typography>
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
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
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProjectInfoPage;
