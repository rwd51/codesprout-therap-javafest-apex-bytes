import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//MUI
import {
  Grid,
  Box,
  Typography,
  Avatar,
  Tooltip as TT,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import Loading from "../misc/Loading";

//values
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import { PARENT_SERVICE_URI, PROJECT_SERVICE_URI, PROBLEMS_SERVICE_URI } from "../../env";

//chatjs
import { Doughnut, Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";

//utils
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import { RiGolfBallFill } from "react-icons/ri";
import { minWidth } from "@mui/system";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Center text plugin for Doughnut Charts
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { width, height, ctx } = chart;

    // Check if centerText exists in the plugins configuration
    const centerTextOptions = chart.config.options.plugins?.centerText;

    if (centerTextOptions) {
      const text = centerTextOptions.text || "";
      const fontSize = centerTextOptions.fontSize || "20px";
      const textColor = centerTextOptions.color || "black";

      ctx.save();
      ctx.font = `bold ${fontSize} sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColor;

      // Split the text into multiple lines by '\n'
      const lines = text.split("\n");

      // Calculate the vertical position for each line
      const lineHeight = parseInt(fontSize, 15); // Convert fontSize to a number
      const totalHeight = lines.length * lineHeight; // Total height of all lines
      const textYPosition = (height - totalHeight) / 2 + 37; // Starting Y position for the first line

      // Render each line
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, textYPosition + index * lineHeight);
      });

      ctx.restore();
    }
  },
};

ChartJS.register(centerTextPlugin);

const avatarsArray = [
  "avatar_1",
  "avatar_2",
  "avatar_3",
  "avatar_4",
  "avatar_5",
  "avatar_6",
  "avatar_7",
  "avatar_8",
  "avatar_9",
];

const users = [
  {
    id: "66c8716c3b2f15380a5f6c57",
    username: "rwd01",
    password: "$2a$10$ArTu18XAMOLDmFqmf80vkezqZ/X9g.Sgnr2GBIVjsqAmOUyVYRVaa",
    name: "Ruwad Naswan",
    email: "ruwad45678@gmail.com",
    age: 10,
    photo: "avatar_1",
    bio: "I love coding and solving puzzles!",
    projectIds: [],
    clonedProjectIds: [],
    solvedPuzzleIds: [],
    topicInterests: [],
    badges: [],
    tag: "NewBie",
  },
  {
    id: "66c8716c3b2f15380a5f6c57",
    username: "rwd02",
    password: "$2a$10$ArTu18XAMOLDmFqmf80vkezqZ/X9g.Sgnr2GBIVjsqAmOUyVYRVaa",
    name: "John Doe",
    email: "johndoe@gmail.com",
    age: 12,
    photo: "avatar_2",
    bio: "Learning web development!",
    projectIds: [],
    clonedProjectIds: [],
    solvedPuzzleIds: [],
    topicInterests: [],
    badges: [],
    tag: "Intermediate",
  },
  // Add more users as needed
];

// fetching all children
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

// fetch project statistics
const fetchProjectStats = async(userID) => {
  try {
    const res = await fetch(
      `${PROJECT_SERVICE_URI}/user/${userID}/stats`,
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
}

// fetch rating statistics
const fetchRatingStats = async(userID) => {
  try {
    const res = await fetch(
      `${PROJECT_SERVICE_URI}/user/${userID}/ratings`,
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
}

//fetch clone count
const fetchCloneCount = async(userID) => {
  try {
    const res = await fetch(
      `${PROJECT_SERVICE_URI}/user/${userID}/clones/count`,
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
}

const fetchProblemSolveCount = async(userID) => {
  try {
    const res = await fetch(
      `${PROBLEMS_SERVICE_URI}/user/${userID}/solveCount`,
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
}

const Statistics = () => {
  const { userID } = useParams();

  const [allChildrenInfo, setAllChildrenInfo] = useState(null);

  useEffect(() => {
    fetchAllChildrenInfo(userID)
      .then((allChildren) => {
        console.log(allChildren);

        setAllChildrenInfo(allChildren);
        setSelectedUser(allChildren[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);

  const layoutRef = useRef(null);

  // State to manage hover effect on charts
  const [hoveredChart, setHoveredChart] = React.useState(null);

  // Define contrasting colors for hover state
  const hoverBackgroundColor = ["#f99afc", "#ff0000", "#FF5722"]; // Contrasting colors on hover
  const hoverTextColor = "#FFFFFF"; // White text color on hover
  const normalTextColor = "black"; // Normal text color

  // Doughnut Chart 1 (3 variables)
  const doughnutData1 = {
    labels: ["Own", "Collaborating", "Cloned"],
    datasets: [
      {
        data: [5,1,1],
        backgroundColor:
          hoveredChart === 1
            ? hoverBackgroundColor
            : ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const doughnutOptions1 = {
    cutout: "70%",
    plugins: {
      centerText: {
        text: `${[5,1,1].reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        )}\nTotal Projects`,
        fontSize: "18px",
        color: hoveredChart === 1 ? hoverTextColor : normalTextColor, // Dynamic color
      },
      legend: {
        labels: {
          color: hoveredChart === 1 ? hoverTextColor : normalTextColor, // Dynamic legend color
        },
      },
    },
  };

  // Bar Chart (5 variables) - Enhanced styling and bigger height
  const barData = {
    labels: ["First Project", "Project 2", "", "", ""],
    datasets: [
      {
        label: "Clones",
        data: [2, 1, 0, 0, 0],
        backgroundColor:
          hoveredChart === 3
            ? "rgba(255,255,0,0.9)"
            : "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // To scale height
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: hoveredChart === 3 ? hoverTextColor : normalTextColor, // Dynamic legend color
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: hoveredChart === 3 ? hoverTextColor : normalTextColor, // Dynamic scale label color
        },
        grid: {
          color: hoveredChart === 3 ? "white" : "rgba(0, 0, 0, 0.3)", // Dynamic grid line color
        },
      },
      y: {
        ticks: {
          color: hoveredChart === 3 ? hoverTextColor : normalTextColor, // Dynamic scale label color
        },
        grid: {
          color: hoveredChart === 3 ? "white" : "rgba(0, 0, 0, 0.3)", // Dynamic grid line color
        },
      },
    },
  };

  // Doughnut Chart 2 (2 variables)
  const doughnutData2 = {
    labels: ["Max Rating", "Average Rating"],
    datasets: [
      {
        data: [4, 2],
        backgroundColor:
          hoveredChart === 2 ? hoverBackgroundColor : ["#fab361", "#9eecf0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const doughnutOptions2 = {
    cutout: "70%",
    plugins: {
      centerText: {
        text: `${3}\nTotal Ratings`,
        fontSize: "18px",
        color: hoveredChart === 2 ? hoverTextColor : normalTextColor, // Dynamic color
      },
      legend: {
        labels: {
          color: hoveredChart === 2 ? hoverTextColor : normalTextColor, // Dynamic legend color
        },
      },
    },
  };

  // Colorful Radar Chart (3 variables)
  const radarData = {
    labels: ["Beginner", "Intermediate", "Advanced"],
    datasets: [
      // {
      //   label: "Attempted",
      //   data: [2, 3, 0],
      //   backgroundColor:
      //     hoveredChart === 4 ? "rgba(255,255,0,0.4)" : "rgba(255, 0, 0, 0.2)",
      //   borderColor: hoveredChart === 4 ? "yellow" : "red",
      //   pointBackgroundColor: "red",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "#FF6384",
      // },
      {
        label: "Solved",
        data: [2, 3, 0],
        backgroundColor:
          hoveredChart == 4 ? "rgba(221, 5, 250, 0.6)" : "rgba(0, 255, 0, 0.6)",
        borderColor: hoveredChart === 4 ? "rgba(221, 5, 250, 1)" : "green",
        pointBackgroundColor: "purple",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#36A2EB",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: hoveredChart === 4 ? hoverTextColor : normalTextColor, // Dynamic legend color
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: hoveredChart === 4 ? hoverTextColor : "black",
        },
        ticks: {
          color: hoveredChart === 4 ? hoverTextColor : "rgba(0, 0, 0, 1)", // Dynamic scale ticks
          backdropColor: "transparent",
        },
        grid: {
          color: hoveredChart === 4 ? hoverTextColor : "rgba(0, 0, 0, 0.6)", // Dynamic grid color
        },
        pointLabels: {
          color: hoveredChart === 4 ? hoverTextColor : "black", // Dynamic point labels
        },
      },
    },
  };

  const applyNoBorderStyles = () => {
    const elements = layoutRef.current.querySelectorAll("div, canvas");
    elements.forEach((el) => {
      // Skip the outermost grid by checking its id or class
      if (!el.classList.contains("outermost-grid")) {
        el.style.border = "none";
        el.style.outline = "none";
        el.style.boxShadow = "none";
      }
    });
  };

  // Function to revert the styles back after PDF generation
  const removeNoBorderStyles = () => {
    const elements = layoutRef.current.querySelectorAll("div, canvas");
    elements.forEach((el) => {
      if (!el.classList.contains("outermost-grid")) {
        el.style.border = "";
        el.style.outline = "";
        el.style.boxShadow = "";
      }
    });
  };

  const [isDownloading, setIsDownloading] = useState(false);

  //const logoUrl = `${window.location.origin}/logo/CodeSprout_Full_Logo_Horizontal_Transparent.png`;
  const downloadPDF = () => {
    const element = layoutRef.current;
    setIsDownloading(true);
    applyNoBorderStyles();

    const scale = 3; // For higher resolution

    // Your logo's URL or base64 image data
    const logoUrl = `${window.location.origin}/logo/CodeSprout_Full_Logo_Horizontal_Transparent.png`;

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
      });
    };

    loadImage(logoUrl)
      .then((logoImg) => {
        const logoNaturalWidth = logoImg.width;
        const logoNaturalHeight = logoImg.height;

        // Scale the logo dimensions by 0.5
        const logoScaledWidth = logoNaturalWidth * 0.05;
        const logoScaledHeight = logoNaturalHeight * 0.05;

        domtoimage
          .toPng(element, {
            filter: (node) => {
              const isButtonOrInvisible =
                node.classList && node.classList.contains("ignore-pdf");
              return !isButtonOrInvisible;
            },
            width: element.offsetWidth * scale,
            height: element.offsetHeight * scale,
            style: {
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: element.offsetWidth + "px",
              height: element.offsetHeight + "px",
            },
          })
          .then((dataUrl) => {
            const pdf = new jsPDF("landscape");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight =
              (element.offsetHeight * imgWidth) / element.offsetWidth;

            const verticalOffset = (pageHeight - imgHeight) / 2;

            // Set background color to #f0f0f0
            pdf.setFillColor("#f0f0f0");
            pdf.rect(0, 0, pageWidth, pageHeight, "F");

            // Add the high-resolution image of the content to the PDF
            pdf.addImage(
              dataUrl,
              "PNG",
              0,
              verticalOffset,
              imgWidth,
              imgHeight
            );

            // Position the logo at the top-right corner
            const logoX = pageWidth - logoScaledWidth - 10; // 10px padding from the right
            const logoY = 10; // 10px padding from the top

            // Add the logo scaled by 0.5 to the PDF
            pdf.addImage(
              logoUrl,
              "PNG",
              logoX,
              logoY,
              logoScaledWidth,
              logoScaledHeight
            );

            // Save the final PDF
            pdf.save(`${selectedUser.username}_progress_report.pdf`);

            removeNoBorderStyles();
            setIsDownloading(false);
          })
          .catch((error) => {
            console.error("Error generating image for PDF:", error);
            setIsDownloading(false); // Ensure the loading state is reset even if there's an error
          });
      })
      .catch((error) => {
        console.error("Error loading logo image:", error);
        setIsDownloading(false);
      });
  };

  //handling user selection
  const [selectedUser, setSelectedUser] = useState(null); // Initialize with the first user

  const handleUserChange = (event) => {
    const selected = allChildrenInfo.find(
      (user) => user.name === event.target.value
    );
    setSelectedUser(selected);
  };

  return (
    <div
      ref={layoutRef}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 10,
        marginBottom: 20,
        border: "none",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Grid
        container
        spacing={2}
        className="outermost-grid"
        sx={{
          height: "85vh",
          width: "98%",
          border: "5px solid black",
          borderRadius: "20px",
          bgcolor: "white",
          mt: 1.5,
          overflow: "hidden",
        }}
      >
        {allChildrenInfo ? allChildrenInfo.length>0?(
          <>
            <Grid item xs={6} sx={{ border: "none", height: "100%" }}>
              <Grid
                container
                direction="column"
                sx={{ height: "102.5%", border: "none", mt: -2 }}
              >
                <Grid item style={{ height: "50%", border: "none" }}>
                  <Grid container style={{ height: "100%", border: "none" }}>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        //justifyContent: "center",
                        paddingLeft: "20px",
                        border: "none",
                      }}
                    >
                      {/* Avatar and descriptive text */}
                      <Avatar
                        alt={selectedUser.username}
                        src={`${window.location.origin}/avatars/avatars_list/${selectedUser.photo}.svg`} // Replace with actual path to avatar image
                        sx={{
                          width: 80,
                          height: 80,
                          marginBottom: "10px",
                          mt: 3,
                          bgcolor: "#f0f0f0",
                          border: "none",
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          textAlign: "left",
                          fontFamily: TITLE,
                          fontWeight: "bold",
                          border: "none",
                          mt: 2,
                        }}
                      >
                        {selectedUser.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          textAlign: "left",
                          fontFamily: TITLE,
                          fontWeight: "bold",
                          border: "none",
                        }}
                      >
                        {`(${selectedUser.username})`}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "left",
                          fontFamily: CONTENT,
                          mt: 1,
                          fontSize: 20,
                          border: "none",
                        }}
                      >
                        {selectedUser.bio}
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
                          Contact Email:
                        </span>{" "}
                        <span
                          style={{
                            textDecoration: "none",
                            fontStyle: "italic",
                            border: "none",
                          }}
                        >
                          {selectedUser.email}
                        </span>{" "}
                      </Typography>

                      <div
                        className="ignore-pdf"
                        style={{ position: "absolute", right: 10, top: 25 }}
                      >
                        <Select
                          value={selectedUser.name} // Display the selected user's name
                          onChange={handleUserChange}
                          sx={{ width: 150, height: 30, bgcolor: "#f0f0f0" }}
                        >
                          {allChildrenInfo.map((user) => (
                            <MenuItem
                              key={user.id}
                              value={user.name}
                              sx={{
                                bgcolor: "#f0f0f0",
                                "&:hover": { bgcolor: "black", color: "white" },
                                "&.Mui-selected": {
                                  bgcolor: "blue",
                                  color: "white",
                                }, // Styles when selected
                                "&.Mui-selected:hover": {
                                  bgcolor: "darkblue",
                                  color: "white",
                                }, // Styles when selected and hovered
                              }}
                            >
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      style={{
                        padding: "25px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          width: "40%",
                          bgcolor: "lightgray",
                          border: "none",
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
                        {selectedUser.tag}
                      </Typography>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          marginTop: 10,
                          marginBottom: -10,
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-around",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        {selectedUser.badges.map((badge, index) => (
                          <TT title={`Badge: ${badge}`}>
                            <Avatar
                              key={index}
                              alt={`Badge ${index + 1}`}
                              src={`${window.location.origin}/badges/${badge}.svg`} // Assumes avatars are stored in this path
                              sx={{
                                width: 68,
                                height: 68,
                                margin: "1px",
                                bgcolor: "black",
                              }}
                            />
                          </TT>
                        ))}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item style={{ height: "50%", border: "none" }}>
                  <Grid container style={{ height: "100%" }}>
                    <Grid
                      item
                      xs={6}
                      style={{ height: "100%", borderRight: "none" }}
                    >
                      {" "}
                      {/* Split into two parts */}
                      <Box
                        style={{
                          height: "100%",
                          border: "none",
                          position: "relative",
                        }}
                      >
                        <div
                          className="ignore-pdf"
                          style={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            border: "none",
                          }}
                        >
                          <CustomRoundedButton
                            textColor={textColor}
                            textColorOnHover={textColorOnHover}
                            backgroundColor={
                              isDownloading ? "black" : buttonBackgroundColor
                            }
                            backgroundColorOnHover={
                              buttonBackgroundColorOnHover
                            }
                            borderRadius={buttonBorderRadius}
                            label={
                              <div style={{ minWidth: 150 }}>
                                {isDownloading ? (
                                  <CircularProgress
                                    size={20}
                                    thickness={40} // Thicker arc (default is 3.6)
                                    style={{ color: "white" }}
                                  />
                                ) : (
                                  "DOWNLOAD REPORT"
                                )}
                              </div>
                            }
                            handleClick={downloadPDF}
                            disabled={isDownloading}
                          />
                        </div>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      style={{ height: "100%", border: "none" }}
                    >
                      {/* Add any content for the right part here */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} sx={{ border: "none", height: "100%" }}>
              <Grid container sx={{ height: "102.6%", border: "none", mt: -2 }}>
                {/* Doughnut Chart 1 with Padding */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "10px",
                    border: "none",
                    height: "50%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        hoveredChart === 1 ? "black" : "transparent",
                    },
                  }}
                  onMouseEnter={() => setHoveredChart(1)}
                  onMouseLeave={() => setHoveredChart(null)}
                >
                  <div
                    style={{
                      width: "82%",
                      margin: "0 auto",
                      border: "none",
                    }}
                  >
                    {" "}
                    {/* Reduce the width to make it smaller */}
                    <Doughnut data={doughnutData1} options={doughnutOptions1} />
                  </div>
                  <Typography
                    sx={{
                      textAlign: "center",
                      mt: 2,
                      color: hoveredChart === 1 ? hoverTextColor : "inherit",
                      fontStyle: CONTENT,
                      fontWeight: "bold",
                      border: "none",
                    }}
                  >
                    Projects
                  </Typography>
                </Grid>
                {/* Bar Chart (bigger height, centered vertically, and with padding) */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    border: "none",
                    height: "50%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        hoveredChart === 3 ? "black" : "transparent",
                    },
                  }}
                  onMouseEnter={() => setHoveredChart(3)}
                  onMouseLeave={() => setHoveredChart(null)}
                >
                  <div
                    style={{
                      height: "70%",
                      width: "100%",
                      border: "none",
                    }}
                  >
                    <Bar data={barData} options={barOptions} height={250} />
                    <Typography
                      sx={{
                        textAlign: "center",
                        mt: 2.7,
                        fontStyle: CONTENT,
                        fontWeight: "bold",
                        border: "none",
                        color: hoveredChart === 3 ? hoverTextColor : "inherit",
                      }}
                    >
                      Clone Statistics (For Own Projects)
                    </Typography>
                  </div>
                </Grid>
                {/* Doughnut Chart 2 with Padding */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "10px",
                    border: "none",
                    height: "50%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        hoveredChart === 2 ? "black" : "transparent",
                    },
                  }}
                  onMouseEnter={() => setHoveredChart(2)}
                  onMouseLeave={() => setHoveredChart(null)}
                >
                  <div
                    style={{
                      width: "80%",
                      margin: "0 auto",
                      border: "none",
                    }}
                  >
                    {" "}
                    {/* Reduce the width to make it smaller */}
                    <Doughnut data={doughnutData2} options={doughnutOptions2} />
                  </div>
                  <Typography
                    sx={{
                      textAlign: "center",
                      mt: 2,
                      fontStyle: CONTENT,
                      fontWeight: "bold",
                      border: "none",
                      color: hoveredChart === 2 ? hoverTextColor : "inherit",
                    }}
                  >
                    Ratings
                  </Typography>
                </Grid>
                {/* Colorful Radar Chart */}
                {/* Radar Chart with Padding */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "10px",
                    border: "none",
                    height: "50%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        hoveredChart === 4 ? "black" : "transparent",
                    },
                  }}
                  onMouseEnter={() => setHoveredChart(4)}
                  onMouseLeave={() => setHoveredChart(null)}
                >
                  <div style={{ border: "none" }}>
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                  <Typography
                    sx={{
                      textAlign: "center",
                      mt: -6.2,
                      fontStyle: CONTENT,
                      fontWeight: "bold",
                      color: hoveredChart === 4 ? hoverTextColor : "inherit",
                      border: "none",
                    }}
                  >
                    Problems Solved
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        ):(
          <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Typography
                fontFamily={CONTENT}
                fontSize={40}
                sx={{ whiteSpace: "pre-line" }}
              >
                You are not assigned to any child yet
              </Typography>
          </div>
        ) : (
          <Box
            sx={{
              p: 15,
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading
              spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
              sprinnerWidth="400px"
              spinnerHeight="400px"
              spinnerImageWidth="350px"
              spinnerImageHeight="350px"
              spinnerColor="#334B71"
              spinnerBackgroundColor="#ebfdff"
            />
          </Box>
        )}
      </Grid>
    </div>
  );
};

export default Statistics;
