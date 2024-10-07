// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// //MUI
// import {
//   Grid,
//   Paper,
//   Typography,
//   Button,
//   Avatar,
//   TextField,
//   Box,
//   Tooltip,
//   Chip,
// } from "@mui/material";

// //chart js
// import { Doughnut } from "react-chartjs-2";
// import "chart.js/auto";
// import { Chart, registerables } from "chart.js";

// //components
// import Loading from "../misc/Loading";

// //values
// import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";

// //URI
// import { USER_SERVICE_URI } from "../../env";

// Chart.register(...registerables);

// // Sample data for the charts
// const data = {
//   labels: ["Red", "Blue", "Yellow"],
//   datasets: [
//     {
//       data: [300, 50, 100],
//       backgroundColor: ["red", "blue", "yellow"],
//       hoverBackgroundColor: ["darkred", "darkblue", "darkyellow"],
//     },
//   ],
// };

// // Chart options with the custom plugin and legend position
// const chartOptions = (labelText) => ({
//   plugins: {
//     legend: {
//       position: "right",
//     },
//     tooltip: {
//       enabled: true,
//       callbacks: {
//         // Filter function to only show tooltips for actual data parts
//         filter: function (tooltipItem, data) {
//           // Check directly if the label of the tooltip item is 'Rest'
//           // This assumes your 'Rest' label is set consistently in your data
//           return data.labels[tooltipItem.dataIndex] !== "Rest";
//         },
//         label: function (tooltipItem) {
//           // Simple label format for demonstration
//           let label = tooltipItem.label || "";
//           if (label !== "Rest") {
//             label += ": " + tooltipItem.parsed;
//           }
//           return label;
//         },
//       },
//     },
//     centerTextPlugin: {
//       centerText: labelText,
//     },
//   },
//   cutout: "70%",
//   radius: "90%",
// });

// // Utility function to generate color and its less opaque version
// const tagColorMap = new Map(); // Cache to store colors for tags

// function getColorForTag(tag) {
//   if (tagColorMap.has(tag)) {
//     return tagColorMap.get(tag);
//   }

//   // Generate a random color
//   const random = Math.random();
//   const randomColor = `hsl(${random * 360}, 70%, 50%)`;
//   const lessOpaqueColor = `hsla(${random * 360}, 70%, 50%, 0.2)`;
//   const colors = { text: randomColor, background: lessOpaqueColor };

//   // Store in map
//   tagColorMap.set(tag, colors);
//   return colors;
// }

// const interests = ["Cars", "Pirates"];
// const level = ["NewBie"];

// //function to fetch details of a particular user
// const fetchUserDetails = async (userID) => {
//   try {
//     const res = await fetch(`${USER_SERVICE_URI}/${userID}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "ngrok-skip-browser-warning": "69420",
//       },
//     });

//     const parseRes = await res.json();
//     if (res.ok) {
//       return parseRes;
//     } else {
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// function ProfilePage() {
//   const [userDetails, setUserDetails] = useState(null);
//   const { ID } = useParams();
//   useEffect(() => {
//     window.scrollTo(0, 0); // Scrolls to the top of the page

//     // Define the custom plugin
//     const centerTextPlugin = {
//       id: "customCenterText",
//       beforeDraw: (chart) => {
//         const ctx = chart.ctx;
//         const text = chart.config.options.plugins.centerTextPlugin.centerText;
//         ctx.save();
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         // Set font size to 24px, font family to Arial, and font weight to bold
//         ctx.font = "bold 24px Arial"; // Example: Change as per your requirement
//         ctx.fillStyle = "black";
//         const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
//         const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
//         ctx.fillText(text, centerX, centerY);
//         ctx.restore();
//       },
//     };

//     // Register the plugin
//     Chart.register(centerTextPlugin);

//     // Cleanup the plugin when component unmounts
//     return () => {
//       Chart.unregister(centerTextPlugin);
//     };
//   }, []);

//   //fetchinf user details
//   useEffect(() => {
//     fetchUserDetails(ID)
//       .then((user) => {
//         setUserDetails(user);
//         console.log(user);
//       })
//       .catch((err) => console.log(err));
//   }, [ID]);

//   // State to toggle edit mode
//   const [editMode, setEditMode] = useState(false);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Grid
//         container
//         spacing={2}
//         padding={2}
//         sx={{
//           maxWidth: "1000px",
//           paddingBottom: 25,
//           paddingTop: 15,
//         }}
//       >
//         {/* User Info Box */}
//         <Grid item xs={12} sm={6}>
//           <Paper
//             elevation={3}
//             sx={{
//               padding: 2,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               height: "100%",
//               borderRadius: "30px",
//             }}
//           >
//             <Typography
//               variant="h4"
//               sx={{
//                 textAlign: "center",
//                 mt: 3,
//                 fontSize: 40,
//                 fontWeight: "bold",
//                 fontFamily: TITLE,
//               }}
//             >
//               User Information
//             </Typography>
//             {!userDetails ? (
//               <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
//                 <Loading
//                   spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
//                   sprinnerWidth="250px"
//                   spinnerHeight="250px"
//                   spinnerImageWidth="200px"
//                   spinnerImageHeight="200px"
//                   spinnerColor="#334B71"
//                   spinnerBackgroundColor="#ebfdff"
//                 />
//               </div>
//             ) : (
//               <>
//                 <Avatar
//                   src={`${window.location.origin}/avatars/avatars_list/${userDetails.photo}.svg`}
//                   sx={{ width: 120, height: 120, my: 2 }}
//                 />{" "}
//                 {/* Replace 'JD' with user initials or image */}
//                 {editMode ? (
//                   <>
//                     <TextField
//                       label="Name"
//                       defaultValue="John Doe"
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 1 }}
//                     />
//                     <TextField
//                       label="Email"
//                       defaultValue="john.doe@example.com"
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mb: 1 }}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontSize: 20,
//                         fontFamily: CONTENT,
//                         fontWeight: "bold",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "1rem",
//                       }}
//                     >
//                       {`${userDetails.name} (${userDetails.username})`}
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           alignSelf: "flex-end",
//                           bgcolor: "lightgray",
//                           px: 2,
//                           py: 1,
//                           borderRadius: "10px",
//                           transition: "all 0.3s ease", // Smooth transition for hover effects
//                           "&:hover": {
//                             bgcolor: "darkgray", // Background color on hover
//                             color: "white", // Text color on hover
//                           },
//                         }}
//                       >
//                         {userDetails.tag}
//                       </Typography>
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ fontSize: 20, fontFamily: CONTENT }}
//                     >
//                       {userDetails.bio}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ fontSize: 15, fontFamily: CONTENT, mb: 2 }}
//                     >
//                       {userDetails.email}
//                     </Typography>
//                     <Box sx={{ my: 1 }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontSize: 15,
//                           fontFamily: CONTENT,
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Interests:{" "}
//                         {userDetails.topicInterests.map((tag, idx) => {
//                           const colors = getColorForTag(tag);
//                           return (
//                             <Tooltip
//                               key={idx}
//                               title={`Tag: ${tag}`}
//                               placement="top"
//                               arrow
//                               sx={{
//                                 tooltip: {
//                                   bgcolor: "black", // Custom background color
//                                 },
//                               }}
//                             >
//                               <Chip
//                                 label={tag}
//                                 sx={{
//                                   mr: 1,
//                                   color: colors.text,
//                                   backgroundColor: colors.background,
//                                   "&:hover": {
//                                     color: "white",
//                                     backgroundColor: colors.text,
//                                   },
//                                 }}
//                               />
//                             </Tooltip>
//                           );
//                         })}
//                       </Typography>
//                     </Box>
//                   </>
//                 )}
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ mt: 5 }}
//                   onClick={() => setEditMode(!editMode)}
//                 >
//                   {editMode ? "Save" : "Edit Info"}
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Grid>

//         {/* Stats Overview Box */}
//         <Grid item xs={12} sm={6}>
//           <Paper
//             elevation={3}
//             sx={{
//               padding: 2,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               height: "100%",
//               borderRadius: "30px",
//             }}
//           >
//             <Typography
//               variant="h3"
//               sx={{
//                 textAlign: "center",
//                 mt: 3,
//                 fontSize: 40,
//                 fontWeight: "bold",
//                 fontFamily: TITLE,
//               }}
//             >
//               Stats Overview
//             </Typography>
//             <div
//               style={{
//                 width: "90%",
//                 height: "90%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 alignSelf: "center",
//               }}
//             >
//               <Doughnut data={data} options={chartOptions("Overall Stats")} />
//             </div>
//           </Paper>
//         </Grid>

//         {/* Detailed Stats Sections */}
//         <Grid container sx={{ mt: 20, p: 3 }}>
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: "bold", fontFamily: TITLE }}
//           >
//             {" "}
//             Detailed Breakdown
//           </Typography>
//           {data.labels.map((label, index) => (
//             <Grid
//               item
//               xs={12}
//               key={label}
//               sx={{ border: "2px solid red", mt: 3 }}
//             >
//               <Grid
//                 container
//                 alignItems="stretch"
//                 style={{ borderRadius: "30px", overflow: "hidden" }}
//               >
//                 <Grid item xs={12} sm={4}>
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       padding: 2,
//                       display: "flex",
//                       flexDirection: "column",
//                       height: "100%",
//                       backgroundColor: "#f7f7ed",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "70%",
//                         height: "100%",
//                         alignSelf: "center",
//                       }}
//                     >
//                       <Doughnut
//                         data={{
//                           labels: [label, "Rest"],
//                           datasets: [
//                             {
//                               data: [
//                                 data.datasets[0].data[index],
//                                 1000 - data.datasets[0].data[index],
//                               ],
//                               backgroundColor: [
//                                 data.datasets[0].backgroundColor[index],
//                                 "rgba(157, 159, 163,0.2)",
//                               ],
//                               hoverBackgroundColor: [
//                                 data.datasets[0].hoverBackgroundColor[index],
//                                 "rgba(157, 159, 163,0.4)",
//                               ],
//                               borderWidth: 0,
//                             },
//                           ],
//                         }}
//                         options={{
//                           ...chartOptions(label),
//                           plugins: {
//                             ...chartOptions(label).plugins,
//                             legend: { display: false },
//                           },
//                           //cutout: "70%", // Adjust cutout percentage if needed
//                           //circumference: 180, // Adjust to create a half-doughnut if desired
//                           //rotation: 270, // Rotates the start position of the doughnut
//                         }}
//                       />
//                     </div>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={12} sm={8}>
//                   <Paper
//                     elevation={3}
//                     sx={{
//                       padding: 2,
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       height: "100%",
//                       backgroundColor: "#f7f7ed",
//                     }}
//                   >
//                     <Typography
//                       variant="h5"
//                       sx={{ fontWeight: "bold", fontFamily: TITLE }}
//                     >
//                       {label}
//                     </Typography>
//                     <Typography variant="body2" fontFamily={CONTENT}>
//                       Description of {label}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//MUI
import {
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  TextField,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";

//chart js
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Chart, registerables } from "chart.js";

//components
import Loading from "../misc/Loading";
import Badges from "./Badges";
import ScrollRightButton from "../misc/ScrollRightButton";
import Interests from "./Interests";
import Tags from "./Tags";
import ProjectContainer from "../YourProjectsPage/ProjectContainer";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";
import { tagColors } from "./TagColor";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

//URI
import {
  USER_SERVICE_URI,
  PROJECT_SERVICE_URI,
  PROBLEMS_SERVICE_URI,
} from "../../env";

Chart.register(...registerables);

// Chart options with the custom plugin and legend position
const chartOptions = (labelText) => ({
  plugins: {
    legend: {
      position: "right",
    },
    tooltip: {
      enabled: true,
      callbacks: {
        // Filter function to only show tooltips for actual data parts
        filter: function (tooltipItem, data) {
          // Check directly if the label of the tooltip item is 'Rest'
          // This assumes your 'Rest' label is set consistently in your data
          return data.labels[tooltipItem.dataIndex] !== "Rest";
        },
        label: function (tooltipItem) {
          // Simple label format for demonstration
          let label = tooltipItem.label || "";
          if (label !== "Rest") {
            label += ": " + tooltipItem.parsed;
          }
          return label;
        },
      },
    },
    centerTextPlugin: {
      centerText: labelText,
    },
  },
  cutout: "70%",
  radius: "90%",
});

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

const interests = ["Cars", "Pirates"];
const level = ["NewBie"];

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
    console.error("Failed to fetch user details:", err.message);
  }
};

const fetchCreativityScore = async (userID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/creativity/${userID}`, {
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

const fetchCollaborationScore = async (userID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}/collaboration/${userID}`, {
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

const fetchProblemSolvingScore = async (userID) => {
  try {
    const res = await fetch(
      `${PROBLEMS_SERVICE_URI}/user/${userID}/problemScore`,
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
      //console.log(parseRes)
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error("Failed to fetch score:", err.message);
  }
};

//fetching project details
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
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

const badges = [
  "Puzzle Prodigy",
  "Code Voyager",
  "Logic Builder",
  "Pathfinder",
  "Speedy Solver",
  "Determined Challenger",
  "Team Player",
  "Project Architect",
  "Badge Hunter",
];

const getRandomLightAndDarkColor = () => {
  const getRandomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const toHex = (value) => value.toString(16).padStart(2, "0");
  const rLight = getRandomValue(150, 255);
  const gLight = getRandomValue(150, 255);
  const bLight = getRandomValue(150, 255);

  const darkFactor = 0.6;
  const rDark = Math.floor(rLight * darkFactor);
  const gDark = Math.floor(gLight * darkFactor);
  const bDark = Math.floor(bLight * darkFactor);

  const lightColor = `#${toHex(rLight)}${toHex(gLight)}${toHex(bLight)}`;
  const darkColor = `#${toHex(rDark)}${toHex(gDark)}${toHex(bDark)}`;

  return { lightColor, darkColor };
};

function ProfilePage({ setLoadingScreen }) {
  const [userDetails, setUserDetails] = useState(null);
  const [creativityScore, setCreativityScore] = useState(null);
  const [collaborationScore, setCollaborationScore] = useState(null);
  const [problemSolvingScore, setProblemSolvingScore] = useState(null);
  const [publicProjects, setPublicProjects] = useState(null);
  const { userID, ID } = useParams();

  const avatarBackgroundColor = getRandomLightAndDarkColor();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page

    // custom plugin
    const centerTextPlugin = {
      id: "customCenterText",
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const text = chart.config.options.plugins.centerTextPlugin.centerText;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "black";
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        ctx.fillText(text, centerX, centerY);
        ctx.restore();
      },
    };

    // Register the plugin
    Chart.register(centerTextPlugin);

    // Cleanup the plugin when component unmounts
    return () => {
      Chart.unregister(centerTextPlugin);
    };
  }, []);

  //fetchinf user details
  useEffect(() => {
    fetchUserDetails(ID)
      .then((user) => {
        setUserDetails(user);

        const fetchAllPublicProjects = async () => {
          try {
            const projects = await Promise.all(
              user.projectIds.map((id) => {
                return fetchProjectDetails(id);
              })
            );
            setPublicProjects(projects.filter((proj) => proj.public === true));
          } catch (err) {
            console.log(err);
          }
        };
        fetchAllPublicProjects();
      })
      .catch((err) => console.log(err));

    fetchCreativityScore(ID)
      .then((score) => {
        console.log(score);
        setCreativityScore(score);
      })
      .then((err) => {
        console.log(err);
      });

    fetchCollaborationScore(ID)
      .then((score) => {
        console.log(score);
        setCollaborationScore(score);
      })
      .then((err) => {
        console.log(err);
      });
    fetchProblemSolvingScore(ID)
      .then((score) => {
        console.log(score);
        setProblemSolvingScore(score);
      })
      .then((err) => {
        console.log(err);
      });
  }, [userID]);

  // Sample data for the charts
  const data = {
    labels: ["Creativity", "Collaboration", "Problem Solving"],
    datasets: [
      {
        data: creativityScore &&
          collaborationScore &&
          problemSolvingScore && [
            creativityScore.creativityScore,
            collaborationScore.collaborationScore,
            problemSolvingScore.problemSolvingScore,
          ],
        backgroundColor: ["red", "blue", "yellow"],
        hoverBackgroundColor: ["darkred", "darkblue", "darkyellow"],
      },
    ],
  };

  const describe = (
    collaborationScore,
    creativityScore,
    problemSolvingScore,
    label
  ) => {
    switch (label) {
      case "Creativity":
        return `Creativity score is ${creativityScore.creativityScore}. The user has made ${creativityScore.ownProjectsCount} projects by yourself and collaborated in ${creativityScore.collaboratingProjectsCount} projects with others`;
        break;
      case "Collaboration":
        return `Collaboration score is ${collaborationScore.collaborationScore}. The user cloned ${collaborationScore.collaboratingProjectsCount} projects.`;
        break;
      case "Problem Solving":
        return `Problem solving score is ${problemSolvingScore.collaboraproblemSolvingScoretionScore}. The user solved ${problemSolvingScore.beginnerSolved} beginner problems, ${problemSolvingScore.intermediateSolved} intermediate problems, and ${problemSolvingScore.advancedSolved} advamced problems`;
        break;
    }
  };
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2fdff",
      }}
    >
      <Grid
        container
        spacing={2}
        padding={2}
        sx={{
          maxWidth: "1000px",
          paddingBottom: 25,
          paddingTop: 5,
        }}
      >
        {/* User Info Box */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              borderRadius: "30px",
              bgcolor: "#fcfbe6",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mt: 3,
                fontSize: 40,
                fontWeight: "bold",
                fontFamily: TITLE,
              }}
            >
              User Information
            </Typography>
            {!userDetails ? (
              <div style={{ display: "flex", flex: 1, alignItems: "center", padding: 70 }}>
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
            ) : (
              <>
                <Avatar
                  src={`${window.location.origin}/avatars/avatars_list/${userDetails.photo}.svg`}
                  sx={{
                    width: 120,
                    height: 120,
                    my: 2,
                    bgcolor: avatarBackgroundColor.lightColor,
                    border: "2px solid black",
                    "&:hover": {
                      border: "5px solid black",
                      bgcolor: avatarBackgroundColor.darkColor,
                    },
                  }}
                />{" "}
                {/* Replace 'JD' with user initials or image */}
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 20,
                      fontFamily: CONTENT,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      mb: 2,
                    }}
                  >
                    {`${userDetails.name} (${userDetails.username})`}
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
                    variant="body1"
                    sx={{
                      textAlign: "left",
                      fontStyle: "italic", // Italicize the "Contact Email:" text
                      fontSize: 10,
                      border: "none",
                      mt: 1,
                    }}
                  >
                    <span
                      style={{
                        textDecoration: "underline",
                        border: "none",
                      }}
                    >
                      Email:
                    </span>{" "}
                    <span
                      style={{
                        textDecoration: "none",
                        fontStyle: "italic",
                        border: "none",
                      }}
                    >
                      {userDetails.email}
                    </span>{" "}
                  </Typography>
                  <Box
                    sx={{
                      my: 1,
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      mt: 7,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 15,
                        fontFamily: CONTENT,
                        fontWeight: "bold",
                      }}
                    >
                      Interests:{" "}
                    </Typography>
                    <Box
                      sx={{
                        border: "5px solid black",
                        borderRadius: "30px",
                        height: 100,
                        maxWidth: "70%",
                        display: "flex",
                        alignItems: "center",
                        overflowX: "auto",
                        gap: "1rem",
                        p: 1,
                        "&:hover": {
                          bgcolor: "#d7f5da",
                          "& .MuiAvatar-root": {
                            border: "5px solid black",
                          },
                        },
                      }}
                    >
                      {/* {userDetails.topicInterests.map((tag, idx) => {
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
                        })} */}
                      <Interests intersts={userDetails.topicInterests} />
                    </Box>
                  </Box>
                </>
                {/* <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 5 }}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Save" : "Edit Info"}
                </Button> */}
              </>
            )}
          </Paper>
        </Grid>

        {/* Stats Overview Box */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              borderRadius: "30px",
              bgcolor: "#f0f0f0",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                mt: 3,
                fontSize: 40,
                fontWeight: "bold",
                fontFamily: TITLE,
              }}
            >
              Stats Overview
            </Typography>
            {userDetails ? (
              <>
                {" "}
                <Box
                  sx={{
                    width: "90%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    pt: 2,
                    pr: 1,
                    pb: 0.5,
                    gap: "1rem",
                  }}
                >
                  <Tags tag="Master Builder" />
                </Box>
                <Box
                  sx={{
                    width: "90%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",

                    //padding: 10,
                    pr: 0.7,
                    gap: "1rem",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      textAlign: "center",
                      fontSize: 20,
                      fontFamily: CONTENT,
                    }}
                  >
                    {
                      (() => {
                        const colors = tagColors["Master Builder"]; // Move `const colors` here
                        return (
                          <Chip
                            label={"Master Builder"}
                            sx={{
                              //mr: 1,
                              color: "black",
                              backgroundColor: colors.light,
                              "&:hover": {
                                color: "white",
                                backgroundColor: colors.dark,
                              },
                            }}
                          />
                        );
                      })() // Immediately invoke function expression (IIFE) to return JSX
                    }
                  </Typography>
                </Box>
                <div
                  style={{
                    width: "100%",
                    height: "80%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Doughnut
                    data={data}
                    options={chartOptions("Overall Stats")}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  padding: 70,
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
          </Paper>
        </Grid>

        {/* Badges */}
        <Grid container sx={{ mt: 10, p: 3, position: "relative" }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", fontFamily: TITLE }}
          >
            {" "}
            Badges
          </Typography>
          <Box
            id="badges-container"
            sx={{
              width: "100%",
              p: 5,
              display: "flex",
              gap: "1rem",
              border: "10px solid black",
              bgcolor: "white",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#334B71",
                color: "white",
                "& .MuiAvatar-root": {
                  border: "5px solid white",
                },
              },
              overflowX: "auto",
            }}
          >
            {userDetails && userDetails.badges.length > 0 ? (
              <Badges badges={badges} />
            ) : userDetails ? (
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
                  No Badges Till Now
                </Typography>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  //padding: 70,
                  width: "100%",
                  //border: '2px solid red'
                }}
              >
                <Loading
                  //spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                  sprinnerWidth="100px"
                  spinnerHeight="100px"
                  spinnerImageWidth="50px"
                  spinnerImageHeight="50px"
                  spinnerColor="red"
                  spinnerBackgroundColor="#ebfdff"
                />
              </div>
            )}
          </Box>
          {userDetails && userDetails.badges.length > 0 && (
            <ScrollRightButton
              id="badges-container"
              tooltipLabel="Scroll Right"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
              top="50%"
              right="40px"
            />
          )}
        </Grid>

        {/* Detailed Stats Sections */}
        <Grid
          container
          sx={{ mt: 10, p: 3, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", fontFamily: TITLE }}
          >
            {" "}
            Detailed Stats Breakdown
          </Typography>
          {collaborationScore && creativityScore && problemSolvingScore ? (
            data.labels.map((label, index) => (
              <Grid
                item
                xs={12}
                key={label}
                sx={{ border: "3px solid black", mt: 3, borderRadius: "30px" }}
              >
                <Grid
                  container
                  alignItems="stretch"
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                >
                  <Grid item xs={12} sm={5}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "180%",
                        backgroundColor: "#f7f7ed",
                      }}
                    >
                      <div
                        style={{
                          width: "80%",
                          height: "180%",
                          alignSelf: "center",
                        }}
                      >
                        <Doughnut
                          data={{
                            labels: [label, "Rest"],
                            datasets: [
                              {
                                data: [
                                  data.datasets[0].data[index],
                                  1000 - data.datasets[0].data[index],
                                ],
                                backgroundColor: [
                                  data.datasets[0].backgroundColor[index],
                                  "rgba(157, 159, 163,0.2)",
                                ],
                                hoverBackgroundColor: [
                                  data.datasets[0].hoverBackgroundColor[index],
                                  "rgba(157, 159, 163,0.4)",
                                ],
                                borderWidth: 0,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions(label),
                            plugins: {
                              ...chartOptions(label).plugins,
                              legend: { display: false },
                            },
                            //cutout: "70%", // Adjust cutout percentage if needed
                            //circumference: 180, // Adjust to create a half-doughnut if desired
                            //rotation: 270, // Rotates the start position of the doughnut
                          }}
                        />
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%",
                        backgroundColor: "#f7f7ed",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", fontFamily: TITLE }}
                      >
                        {label}
                      </Typography>
                      <Typography variant="body2" fontFamily={CONTENT}>
                        {describe(
                          collaborationScore,
                          creativityScore,
                          problemSolvingScore,
                          label
                        )}
                      </Typography>
                      {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          marginTop: 60,
                        }}
                      >
                        <CustomRoundedButton
                          textColor={textColor}
                          textColorOnHover={textColorOnHover}
                          backgroundColor={buttonBackgroundColor}
                          backgroundColorOnHover={buttonBackgroundColorOnHover}
                          borderRadius={buttonBorderRadius}
                          label={
                            label === "Creativity"
                              ? "MAKE MORE PROJECTS"
                              : label === "Collaboration"
                              ? "EXPLORE MORE PROJECTS"
                              : "SOLVE MORE PROBLEMS"
                          }
                          handleClick={() => {
                            label === "Creativity"
                              ? navigate(`/kids/${userID}/codeEditor`)
                              : label === "Collaboration"
                              ? navigate(`/kids/${userID}/exploreProjects`)
                              : navigate(`/kids/${userID}/problems`);
                          }}
                        />
                      </div> */}
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            ))
          ) : (
            <div
              style={{
                marginTop: 40,
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 100,
                border: "10px solid black",
                borderRadius: "30px",
                backgroundColor: "white",
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
        <Grid container sx={{ mt: 3, p: 3}}>
        <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", fontFamily: TITLE }}
          >
            {" "}
            All Public Projects
          </Typography>
          <ProjectContainer
            projects={publicProjects} //{filteredProjects}
            scroll_id={"user-public-projects-container"}
            title={"Projects"}
            height={"90vh"}
            setLoadingScreen={setLoadingScreen}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ProfilePage;
