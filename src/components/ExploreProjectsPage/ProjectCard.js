import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

//MUI
import {
  Box,
  Typography,
  Chip,
  Link,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

//icons
import InfoIcon from "@mui/icons-material/Info";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import Loading from "../misc/Loading";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

//URI
import { PROJECT_SERVICE_URI, USER_SERVICE_URI } from "../../env";

//firebase
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import storage from "../../firebase-config";

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

//extracting the date in DD/MM/YYY
function extractDate(datetimeString) {
  const dateObj = new Date(datetimeString);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

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

function ProjectCard({
  project,
  showImage = true,
  own = false,
  setLoadingScreen,
}) {
  //using navigation
  const navigate = useNavigate();

  //handling opening project in editor
  const openProjectInEditor = (userID, projectID) => {
    navigate(`/kids/${userID}/codeEditor/${projectID}/null`, { replace: true });
  };

  const { userID } = useParams();
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);
  const [projectCoverURL, setProjectCoverURL] = useState(null);

  useEffect(() => {
    fetchUserDetails(userID)
      .then((user) => setCurrentUserDetails(user))
      .catch((err) => {
        console.log(err);
      });

    fetchUserDetails(project.userId)
      .then((user) => setUserDetails(user))
      .catch((err) => console.log(err));

    const fetchAllCollaborators = async () => {
      try {
        const collaborators = await Promise.all(
          project.collaborators.map((collaboratorID) =>
            fetchUserDetails(collaboratorID)
          )
        );
        setCollaboratorDetails(collaborators);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCollaborators();

    getImageUrl(project.projectId)
      .then((url) => setProjectCoverURL(url))
      .catch((err) => console.log(err));
  }, [project]);

  //handling project clone
  const handleCloneProject = async (userDetails, project) => {
    try {
      setLoadingScreen(true);
      console.log(project);
      const res = await fetch(
        `${PROJECT_SERVICE_URI}/clone/${userDetails.id}`,
        {
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
        }
      );

      const parseRes = await res.json();

      if (res.ok) {
        return duplicateFileInFirebase(project.projectId, parseRes.projectId)
          .then(() => {
            return parseRes; // Return the parsed response here
          })
          .catch((err) => {
            console.log(err);
            throw err; // Propagate the error
          });
      } else {
      }
    } catch (err) {
      console.error("Error fetching /*...*/", err.message);
    } finally {
      setLoadingScreen(false);
    }
  };

  return (
    <Card sx={{ width: "100%", borderRadius: "30px" }}>
      <Link
        component={RouterLink}
        to={`/kids/${userID}/projectInfo/${project.projectId}`}
      >
        {showImage &&
          (projectCoverURL ? (
            <CardMedia
              component="img"
              image={projectCoverURL}
              alt="Post image"
              sx={{
                border: "3px solid black",
                borderRadius: "30px 30px 0px 0px",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 400, // Adjust the height as needed
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid black",
                borderRadius: "30px 30px 0px 0px",
                backgroundColor: "#f0f0f0", // A light gray background
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
            </Box>
          ))}
      </Link>
      <CardContent>
        <Link
          component={RouterLink}
          to={`/kids/${userID}/projectInfo/${project.projectId}`}
          color="inherit"
          underline="hover"
        >
          <Typography
            gutterBottom
            variant="h5"
            fontFamily={TITLE}
            fontWeight="bold"
            component="div"
          >
            {project.projectName}
          </Typography>
        </Link>

        {userDetails && !own && (
          <div style={{ display: "flex" }}>
            <Typography variant="body1" color="text.secondary">
              {`Created by\u00A0`}
            </Typography>
            <Tooltip
              // title={
              //   <Box sx={{ display: "flex", alignItems: "center" }}>
              //     <InfoIcon sx={{ color: "white", mr: 1 }} />
              //     <Typography variant="body2" color="white">
              //       {`Username: ${name} (${username})`}
              //     </Typography>
              //   </Box>
              // }
              // placement="top"
              // arrow
              // sx={{
              //   tooltip: {
              //     bgcolor: "black", // Custom background color
              //   },
              // }}
              title="View Profile"
            >
              <Link
                component={RouterLink}
                to={`/kids/${userID}/profile`}
                color="inherit"
                underline="hover"
              >
                <Typography
                  variant="body1"
                  fontFamily={CONTENT}
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {`${userDetails.name} (${userDetails.username})`}
                </Typography>
              </Link>
            </Tooltip>
            <Typography variant="body1" color="text.secondary">
              {`\u00A0on ${extractDate(
                project.creationDate
              )}\u00A0(Last Update:\u00A0${extractDate(
                project.lastUpdateDate
              )})`}
            </Typography>
          </div>
        )}
        {project && own && (
          <div style={{ display: "flex" }}>
            <Typography variant="body1" color="text.secondary">
              {`Created on`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {`\u00A0${extractDate(project.creationDate)}`}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              fontStyle="italic"
            >
              {`\u00A0(Last Update:\u00A0${extractDate(
                project.lastUpdateDate
              )})`}
            </Typography>
          </div>
        )}

        <Box sx={{ my: 1 }}>
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

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Collaborators:{" "}
          {collaboratorDetails.length !== 0 &&
            collaboratorDetails
              .map((collaborator) => (
                <Tooltip
                  // key={collaborator.name}
                  // title={
                  //   <Box sx={{ display: "flex", alignItems: "center" }}>
                  //     <InfoIcon sx={{ color: "white", mr: 1 }} />
                  //     <Typography variant="body2" color="white">
                  //       {collaborator.detail}
                  //     </Typography>
                  //   </Box>
                  // }
                  // placement="top"
                  // arrow
                  // componentsProps={{
                  //   tooltip: {
                  //     sx: {
                  //       bgcolor: "red", // Background color for the tooltip content
                  //       color: "black", // Text color for the tooltip content
                  //     },
                  //     arrow: {
                  //       sx: {
                  //         color: "green", // Background color for the tooltip arrow
                  //       },
                  //     },
                  //   },
                  //   arrow: {
                  //     sx: {
                  //       color: "blue", // Ensure the arrow's color is the same as the tooltip background
                  //     },
                  //   },
                  // }}
                  title="View Profile"
                >
                  <Link
                    component={RouterLink}
                    to={`/kids/${userID}/profile/${collaborator.id}`}
                    color="inherit"
                    underline="hover"
                    variant="body2"
                    fontFamily={CONTENT}
                    fontWeight="bold"
                  >
                    {collaborator.username}
                  </Link>
                </Tooltip>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
        </Typography>
        <div
          style={{
            width: "100%",
            height: 40,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CustomRoundedButton
            textColor={textColor}
            textColorOnHover={textColorOnHover}
            backgroundColor={buttonBackgroundColor}
            backgroundColorOnHover={buttonBackgroundColorOnHover}
            borderRadius={buttonBorderRadius}
            label={own ? "OPEN IN EDITOR" : "CLONE PROJECT"}
            handleClick={() => {
              own
                ? openProjectInEditor(userID, project.projectId)
                : handleCloneProject(currentUserDetails, project)
                    .then((proj) => {
                      navigate(
                        `/kids/${currentUserDetails.id}/codeEditor/${proj.projectId}/null`
                      );
                      console.log(proj);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
