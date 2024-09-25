import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CodeBlocks from "./components/CodeBlocks";
import Code from "./components/Code";
import PreviewArea from "./components/PreviewArea";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { makeStyles } from "@mui/styles";

//MUI
import {
  Box,
  IconButton,
  Typography,
  Modal,
  Tooltip,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//ss library
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image-more";

import { initializeAllLists, dummy } from "./redux/midarea/actions";
import { setCharacterList } from "./redux/character/actions";
import SpriteManager from "./components/SpriteManager";

//icons
import { VscSaveAs } from "react-icons/vsc";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FaFlagCheckered } from "react-icons/fa6";

//utililty functions
import { getComponentElement } from "./utils/getComponentElement";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../../values/Button";

//components
import CustomRoundedTextField from "../../misc/CustomRoundedTextField";
import CustomRoundedButton from "../../misc/CustomRoundedButton";
import AutomcompleteTextField from "../../misc/AutomcompleteTextField";
import Loading from "../../misc/Loading";
import ScrollDownButton from "../../misc/ScrollDownButton";
import MiniChatBot from "./components/MiniChatBot/MiniChatBot";
import LevelCompleteScreen from "./components/LevelCompleteScreen";
import WrongSubmissionErrorMessage from "./components/WrongSubmissionErrorMessae";

//firebase
import { connectStorageEmulator, ref, uploadString } from "firebase/storage";
import storage from "../../../firebase-config";

//backend URI
import {
  PROBLEMS_SERVICE_URI,
  PROJECT_SERVICE_URI,
  USER_SERVICE_URI,
} from "../../../env";

//sample data
const users = [
  { username: "john_doe" },
  { username: "jane_smith" },
  { username: "alice_wonder" },
  { username: "bob_builder" },
  { username: "charlie_brown" },
];
const tags = [
  { tag_name: "Drawing" },
  { tag_name: "Games" },
  { tag_name: "Magic" },
  { tag_name: "Maths" },
  { tag_name: "Music" },
  { tag_name: "Mystery" },
  { tag_name: "Pirates" },
  { tag_name: "Puzzles" },
  { tag_name: "Science" },
  { tag_name: "Adventure" },
  { tag_name: "Aliens" },
  { tag_name: "Ancient History" },
  { tag_name: "Animals and Nature" },
  { tag_name: "Cooking" },
  { tag_name: "Dinosaurs" },
  { tag_name: "Space" },
  { tag_name: "Sports" },
  { tag_name: "Stories" },
  { tag_name: "Superheores" },
  { tag_name: "Underwater Adventures" },
];

const extractUserDetailsfromIDs = (IDarray, allUserDetails) => {
  let filteredUsers = [];
  allUserDetails.forEach((user) => {
    if (IDarray.includes(user.id)) {
      filteredUsers.push(user);
    }
  });

  return filteredUsers;
};

const extractIDFromUsersArray = (users) => {
  return users.map((user) => user.id);
};

const extractTagNames = (tagsArray) => {
  return tagsArray.map((tag) => tag.tag_name);
};

//function to fetch a project into the editor
const fetchProject = async (projectID) => {
  try {
    const res = await fetch(`${PROJECT_SERVICE_URI}?id=${projectID}`, {
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

//function to fetch all users except me
const fetchAllUsersExceptMe = async (userID) => {
  try {
    const res = await fetch(`${USER_SERVICE_URI}/getUsersExceptMe/${userID}`, {
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

//checking solution of problem
const checkSolution = async (
  userID,
  problemID,
  midAreaLists,
  setLoadingScreen,
) => {
  try {

    setLoadingScreen(true);

    const res = await fetch(`${PROBLEMS_SERVICE_URI}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({
        userId: userID,
        problemId: problemID,
        midAreaLists: midAreaLists,
      }),
    });

    const parseRes = await res.json();

    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  } finally {
    setLoadingScreen(false);
  }
};

function CodeEditor({
  complist,
  character,
  initialize_all_lists,
  set_character_list,
  update_list,
  dummy_func,
  setLoadingScreen,
}) {
  useEffect(() => {
    console.log(complist.midAreaLists);
  }, [complist]);

  //using navigation
  const navigate = useNavigate();

  //keeping track of whether code is loading or not
  const [isCodeLoading, setIsCodeLoading] = useState(false);

  //fetching project or problem data
  const { userID, projectID, problemID } = useParams();
  const [project, setProject] = useState(null);

  //project data
  const [collaboratos, setCollaborators] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [publicStatus, setPublicStatus] = useState(true);

  //problems
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);


  //fetching all users except me
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (projectID && projectID !== "null") {
      fetchProject(projectID)
        .then((proj) => {
          setProject(proj);

          //updating current project info
          setProjectName(proj.projectName);
          setProjectDescription(proj.description);
          setPublicStatus(proj.public);
          setSuggestedTags(proj.tags);

          fetchAllUsersExceptMe(proj.userId)
            .then((users) => {
              setCollaborators(
                extractUserDetailsfromIDs(proj.collaborators, users)
              );
            })
            .catch((err) => {
              console.log(err);
            });

          fetchAllUsersExceptMe(proj.userId)
            .then((users) => {
              setAllUsers(users);
            })
            .catch((err) => {
              console.log(err);
            });

          initialize_all_lists(proj.midAreaLists);
          set_character_list(proj.characters, proj.active);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [projectID]);

  // useEffect(() => {}, [userID]);

  function compareArrays(arr1, arr2, length) {
    const maxLength = Math.min(arr1.length, arr2.length, length);

    if (maxLength === 0) return false;

    for (let i = 0; i < maxLength; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  // Update Lists of Mid Area
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Early return if dropped outside a droppable area
    if (!destination) {
      return;
    }

    let element;
    if (draggableId.split(".").length === 1)
      element = draggableId.split("-")[0];
    else {
      element = draggableId
        .split(".")[0]
        .substring("element-comp".length)
        .split("-")[0];
    }

    const old_list = complist.midAreaLists;

    // Handle dragging within the same or different Repeat components
    if (
      source.droppableId.startsWith(
        "element"
      ) /*|| destination.droppableId.startsWith('element')*/
    ) {
      const arr = String(source.droppableId).split("-");

      const midAreaListIndex = parseInt(arr[3], 10);
      const outermostRepeatBlockIndex = parseInt(arr[4], 10);

      let sourceComponentIndex = [outermostRepeatBlockIndex];

      for (let i = 5; i < arr.length; i++) {
        // Split on the dot and take the second element which should be a number
        const index = arr[i].split(".")[1];
        if (index !== undefined) {
          sourceComponentIndex.push(parseInt(index, 10));
        }
      }
      const currentList = old_list[midAreaListIndex].comps;

      let comp = currentList[sourceComponentIndex[0]].values[1];
      for (let i = 1; i < sourceComponentIndex.length - 1; i++) {
        comp = currentList[sourceComponentIndex[i]].values[1];
      }

      const [moved] = comp.splice(source.index, 1);

      if (destination.droppableId.startsWith("element")) {
        const arr = String(destination.droppableId).split("-");

        const midAreaListIndex = parseInt(arr[3], 10);
        const outermostRepeatBlockIndex = parseInt(arr[4], 10);

        let componentIndex = [outermostRepeatBlockIndex];

        for (let i = 5; i < arr.length; i++) {
          // Split on the dot and take the second element which should be a number
          const index = arr[i].split(".")[1];
          if (index !== undefined) {
            componentIndex.push(parseInt(index, 10));
          }
        }

        if (
          compareArrays(
            componentIndex,
            sourceComponentIndex,
            sourceComponentIndex.length - 1
          )
        ) {
          if (
            sourceComponentIndex[sourceComponentIndex.length - 1] <
            componentIndex[sourceComponentIndex.length - 1]
          ) {
            componentIndex[sourceComponentIndex.length - 1] -= 1;
          }
        }
        const currentList = old_list[midAreaListIndex].comps;
        let comp = currentList[componentIndex[0]].values[1];
        for (let i = 1; i < componentIndex.length - 1; i++) {
          comp = currentList[componentIndex[i]].values[1];
        }
        comp.splice(destination.index, 0, moved);
      } else {
        let dest_index = old_list.findIndex(
          (x) => x.id === destination.droppableId
        );

        if (dest_index > -1) {
          let dest_comp_list = old_list[dest_index].comps;
          dest_comp_list.splice(destination.index, 0, moved);
          old_list[dest_index].comps = dest_comp_list;
        }
      }
      //console.log(old_list);

      initialize_all_lists(old_list);

      // update_list([...old_list]);
    } else {
      let source_index = old_list.findIndex((x) => x.id === source.droppableId);

      let el;

      if (source_index > -1) {
        let comp_list = old_list[source_index].comps;
        [el] = comp_list.splice(source.index, 1);
        old_list[source_index].comps = comp_list;
      }

      if (destination.droppableId.startsWith("element")) {
        const arr = String(destination.droppableId).split("-");

        const midAreaListIndex = parseInt(arr[3], 10);
        const outermostRepeatBlockOldIndex = parseInt(arr[4], 10);

        let outermostRepeatBlockNewIndex;
        if (source.index > outermostRepeatBlockOldIndex)
          outermostRepeatBlockNewIndex = outermostRepeatBlockOldIndex;
        else outermostRepeatBlockNewIndex = outermostRepeatBlockOldIndex - 1;

        let componentIndex = [outermostRepeatBlockNewIndex];

        for (let i = 5; i < arr.length; i++) {
          // Split on the dot and take the second element which should be a number
          const index = arr[i].split(".")[1];
          if (index !== undefined) {
            componentIndex.push(parseInt(index, 10));
          }
        }

        const currentList = old_list[midAreaListIndex].comps;

        let comp = currentList[componentIndex[0]].values[1];
        for (let i = 1; i < componentIndex.length - 1; i++) {
          comp = currentList[componentIndex[i]].values[1];
        }

        comp.splice(destination.index, 0, el);

        //console.log(old_list);
        initialize_all_lists(old_list);
      } else {
        let dest_index = old_list.findIndex(
          (x) => x.id === destination.droppableId
        );

        if (dest_index > -1) {
          let dest_comp_list = old_list[dest_index].comps;
          if (source_index > -1) {
            dest_comp_list.splice(destination.index, 0, el);
          } else {
            dest_comp_list.splice(
              destination.index,
              0,
              getComponentElement(element)
            );
          }

          //console.log(dest_comp_list);
          old_list[dest_index].comps = dest_comp_list;

          //console.log(complist.midAreaLists);
        }
      }
    }
  };

  //for save modal
  const [open, setOpen] = useState(false);
  const handleOpenSaveMenu = () => {
    setOpen(true);
    takeScreenshot();
    setTriggerRender(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTriggerRender(false);
  };

  const [screenshotUrl, setScreenshotUrl] = useState(null);

  //ss before save
  const captureRef = useRef(null);

  const [triggerRender, setTriggerRender] = useState(false);

  // Re-render the component to ensure the latest state is captured
  useEffect(() => {
    if (triggerRender) {
      takeScreenshot();
    }
  }, [triggerRender]);

  const applyNoBorderStyles = () => {
    const elements = captureRef.current.querySelectorAll("div");
    elements.forEach((el) => {
      el.style.border = "none";
      el.style.outline = "none";
      el.style.boxShadow = "none";
    });
  };

  const removeNoBorderStyles = () => {
    const elements = captureRef.current.querySelectorAll("div");
    elements.forEach((el) => {
      el.style.border = "";
      el.style.outline = "";
      el.style.boxShadow = "";
    });
  };

  const takeScreenshot = () => {
    if (captureRef.current) {
      applyNoBorderStyles(); // Apply inline styles to remove borders

      // Set the scale factor to increase the resolution
      const scaleFactor = 3; // Increase this value to improve the resolution further

      domtoimage
        .toPng(captureRef.current, {
          quality: 1, // Quality setting for the output image
          width: captureRef.current.offsetWidth * scaleFactor,
          height: captureRef.current.offsetHeight * scaleFactor,
          style: {
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            width: `${captureRef.current.offsetWidth}px`,
            height: `${captureRef.current.offsetHeight}px`,
          },
        })
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;

          img.onload = () => {
            // Set the amount you want to crop from the left (in pixels)
            const cropAmount = 25 * scaleFactor; // Adjust cropAmount according to scale

            // Create a canvas to draw the cropped image
            const canvas = document.createElement("canvas");
            canvas.width = img.width - cropAmount; // Set canvas width after cropping
            canvas.height = img.height; // Maintain the original height

            const ctx = canvas.getContext("2d");

            // Draw the cropped image onto the canvas
            ctx.drawImage(
              img,
              cropAmount,
              0,
              img.width - cropAmount,
              img.height,
              0,
              0,
              img.width - cropAmount,
              img.height
            );

            // Convert the canvas back to a data URL
            const croppedDataUrl = canvas.toDataURL("image/png");

            // Set the cropped image URL as the screenshot
            setScreenshotUrl(croppedDataUrl);
            removeNoBorderStyles(); // Remove inline styles after screenshot
          };
        })
        .catch((error) => {
          console.error("Error capturing screenshot:", error);
          removeNoBorderStyles(); // Ensure styles are removed on error
        })
        .finally(() => setTriggerRender(false)); // Reset the re-render trigger
    }
  };

  //handling modal loading
  const [isModalLoading, setIsModalLoading] = useState(true);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsModalLoading(false);
      }, 1000); // 1 second

      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setIsModalLoading(true); // Reset loading state when modal is closed
    }
  }, [open]);

  //uploading project cover photo to firebase
  const uploadScreenshotToFirebase = async (screenshotUrl, projectName) => {
    const storageRef = ref(storage, `projects/covers/${projectName}.png`);

    uploadString(storageRef, screenshotUrl, "data_url")
      .then((snapshot) => {
        console.log("Screenshot uploaded successfully!", snapshot);
      })
      .catch((error) => {
        console.error("Error uploading the image to Firebase:", error);
      });
  };

  // for manipulating userdata (for collaborators and tags suggestions in) and tagdata
  // while saving projects

  const tagNames = extractTagNames(tags);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };
  const handleProjectDescriptionChange = (e) => {
    setProjectDescription(e.target.value);
  };

  //handling project submission
  const handleCreateProject = async () => {
    try {
      setLoadingScreen(true);

      const res = await fetch(`${PROJECT_SERVICE_URI}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //'token': localStorage.token
        },
        body: JSON.stringify({
          projectName: projectName,
          description: projectDescription,
          userId: userID,
          clonedUserIds: [],
          tags: suggestedTags,
          public: publicStatus,
          collaborators: extractIDFromUsersArray(collaboratos),
          midAreaLists: complist.midAreaLists,
          characters: character.characters,
          active: character.active,
          ratings: {},
        }),
      });

      const parseRes = await res.json();

      if (res.ok) {
        console.log("Success...\nSubmitting cover photo...");

        console.log(parseRes);

        uploadScreenshotToFirebase(screenshotUrl, parseRes.projectId)
          .then(() => {
            navigate(`/kids/${userID}/codeEditor/${parseRes.projectId}/null`);
          })
          .catch((err) => console.log(err));
      } else {
      }
    } catch (err) {
      console.error("Error fetching /*...*/", err.message);
    } finally {
      setLoadingScreen(false);
      handleClose();
    }
  };

  const handleUpdateProject = async () => {
    try {
      setLoadingScreen(true);

      const res = await fetch(`${PROJECT_SERVICE_URI}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //'token': localStorage.token
        },
        body: JSON.stringify({
          projectId: projectID,
          projectName: projectName,
          description: projectDescription,
          userId: project.userId,
          clonedUserIds: project.clonedUserIds,
          creationDate: project.creationDate,
          lastUpdateDate: new Date(),
          tags: suggestedTags,
          public: publicStatus,
          collaborators: extractIDFromUsersArray(collaboratos),
          midAreaLists: complist.midAreaLists,
          characters: character.characters,
          active: character.active,
          ratings: project.ratings,
        }),
      });

      const parseRes = await res.json();

      if (res.ok) {
        console.log("Success...\nSubmitting cover photo...");

        console.log(parseRes);

        uploadScreenshotToFirebase(screenshotUrl, projectID)
          .then(() => {
            navigate(`/kids/${userID}/codeEditor/${projectID}/null`);
          })
          .catch((err) => console.log(err));
      } else {
      }
    } catch (err) {
      console.error("Error fetching /*...*/", err.message);
    } finally {
      setLoadingScreen(false);
      handleClose();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        fontFamily: "sans-serif", // Equivalent to font-sans
        marginBottom: -10,
        position: "relative",
      }}
    >
      <div
        style={{
          height: "98vh", // Equivalent to h-screen
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          paddingTop: "10px", // Equivalent to pt-6 (1.5rem where 1 rem = 16px)
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            sx={{
              position: "relative",
              width: "310px", // w-70 (assuming a fixed pixel width as Tailwind's `w-70` might be custom)
              height: "90%", // h-5/6 (5/6 of the parent height)
              //overflow: "hidden",
              padding: "1rem", // p-4
              paddingBottom: 0, // pb-0
              paddingTop: 0, // pt-0
              backgroundColor: "#d5eef7", // bg-red-100
              borderRadius: "0.5rem", // rounded-lg
              border: "1px solid #e5e7eb", // border and border-gray-200
              marginLeft: "2rem", // ml-8
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
              "&:hover": {
                backgroundColor: "#c0ebfa",
              },
            }}
          >
            <CodeBlocks />
            <ScrollDownButton
              id="code-blocks-container"
              iconColor="#334B71"
              iconBackgroundColor="#93db81"
              iconColorOnHover="white"
              iconBackgroundColorOnHover="#334B71"
              tooltipLabel="Scroll Down"
              //left="50%"
            />
          </Box>

          <Box
            sx={{
              marginLeft: "2rem", // ml-8
              flex: 1, // flex-1
              height: "90%", // h-5/6 (5/6 of the parent height)
              //overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#c7edbe",
              borderRadius: "0.5rem", // rounded-lg
              border: "1px solid #e5e7eb", // border and border-gray-200
              marginRight: "2rem", // mr-2
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
              "&:hover": {
                backgroundColor: "#c4e3bc",
              },
            }}
          >
            <Code isCodeLoading={isCodeLoading} />
          </Box>

          <div
            style={{
              width: "45%", // w-1/3
              position: "relative",
              height: "90%", // h-5/6 (5/6 of the parent height)
              //overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Center vertically
              alignItems: "center", // Center horizontally
              //backgroundColor: "white",
              //borderRadius: "15px", // rounded-lg
              //border: "1px solid #e5e7eb", // border and border-gray-200
              //borderTopLeftRadius: "1.25rem", // rounded-tl-xl
              marginLeft: "0.5rem", // ml-2
              //marginRight: "2rem", // mr-8
              //border: "2px solid green",
              gap: "5px",
            }}
          >
            <div
              ref={captureRef}
              style={{
                position: "relative",
                height: "65%", // 3/7 of the parent height
                width: "100%", // Full width
                display: "flex",
                overflow: "hidden",
                flexDirection: "row",
                backgroundColor: "white",
                border: "1px solid gray",
                borderRadius: "10px",
                borderTopLeftRadius: "1.25rem",
                marginLeft: "0.5rem",
                marginRight: "2rem",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <PreviewArea />
            </div>
            <div
              style={{
                position: "relative",
                height: "35%", // 4/7 of the parent height
                width: "100%", // Full width
                overflowY: "auto",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                border: "1px solid gray",
                borderRadius: "10px",
                borderTopLeftRadius: "1.25rem",
                marginLeft: "0.5rem",
                marginRight: "2rem",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <SpriteManager />
              <ScrollDownButton
                id="sprite-manager-container"
                iconColor="#334B71"
                iconBackgroundColor="#93db81"
                iconColorOnHover="white"
                iconBackgroundColorOnHover="#334B71"
                tooltipLabel="Scroll Down"
                //left="50%"
              />
              {problemID && problemID !== "null" && (
                <Tooltip title="Sprite Manager Not Accessible While Solving Problems">
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#f0f0f0",
                      opacity: 0.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              )}
            </div>
          </div>

          {/* <div className="w-1/9 relative h-5/6 overflow-scroll flex flex-row bg-white border rounded-lg border-gray-200 rounded-tl-xl ml-2 mr-8">
  <Repeat />
</div> */}
        </DragDropContext>
      </div>
      {/* {true ||
        (true && ( */}
          <>
            <Tooltip
              title={
                projectID && problemID === "null"
                  ? "Update Project"
                  : problemID
                  ? "Submit"
                  : "Save Project"
              }
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 25,
                  right: 25,
                  zIndex: 500,
                  color: "black",
                  "&:hover": { color: "white", backgroundColor: "#334B71" },
                }} // Adjust positioning as needed
                onClick={() => {
                  handleOpenSaveMenu();
                }}
              >
                <VscSaveAs />
              </IconButton>
            </Tooltip>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1200,
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  width: "700px",
                  height: "700px", // Increased height to accommodate text fields and spacing
                  overflow: "hidden",
                  borderRadius: "20px",
                  boxShadow: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between", // Ensures space distribution
                  alignItems: "center",
                  backgroundColor: "#f1fcf0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#cefcca",
                    width: "100%",
                    "&:hover": { backgroundColor: "#bbfcb6" },
                  }}
                >
                  <Typography
                    id="simple-modal-title"
                    variant="h4"
                    component="h2"
                    fontFamily={TITLE}
                    fontWeight="bold"
                    display="flex"
                    gap="1rem"
                    alignItems="center"
                    marginTop="20px"
                    marginBottom="20px"
                  >
                    Save Configurations <VscSaveAs />
                  </Typography>
                </Box>

                <div
                  id="save-configurations-container"
                  style={{
                    //position: "absolute",
                    width: "700px",
                    //height: "700px", // Increased height to accommodate text fields and spacing

                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Ensures space distribution
                    alignItems: "center",
                    overflow: "auto", // Adds scroll if content exceeds the modal height
                  }}
                >
                  {isModalLoading || !screenshotUrl ? (
                    <div
                      style={{
                        //maxWidth: "650px", // Fixed maximum dimensions for the image
                        //maxHeight: "420px",
                        border: "5px solid black",
                        borderRadius: "10px",
                        width: "600px",
                        //height: "700px",
                        margin: "10px auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 80,
                        backgroundColor: "#ffffc2",
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
                  ) : (
                    <img
                      src={screenshotUrl}
                      alt="Screenshot"
                      style={{
                        maxWidth: "650px", // Fixed maximum dimensions for the image
                        maxHeight: "420px",
                        border: "5px solid black",
                        borderRadius: "10px",
                        width: "auto",
                        height: "auto",
                        display: "block",
                        margin: "10px auto", // Added margin for spacing
                      }}
                    />
                  )}
                  <Grid
                    container
                    sx={{
                      border: "1px solid black",
                      marginTop: "40px",
                      borderRadius: "30px",
                      padding: 2,
                      backgroundColor: "#ffffc2",
                      "&:hover": {
                        border: "2px solid black",
                        backgroundColor: "#ffffb3",
                      },
                    }}
                  >
                    <Grid item xs={12} md={12}>
                      <Typography fontFamily={CONTENT} fontWeight="bold">
                        Select your project's visbility
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Tooltip title="Your project will be publicly available for others to view and clone">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={publicStatus}
                              onChange={() => {
                                setPublicStatus(true);
                              }}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 25,
                                  color: "#496fab",
                                },
                                "&:hover .MuiSvgIcon-root": {
                                  color: "white",
                                  backgroundColor: "#334B71",
                                },
                              }}
                              disabled={project && userID !== project.userId}
                            />
                          }
                          label="Public"
                          sx={{
                            fontSize: "1rem",
                            "& .MuiTypography-root": {
                              fontSize: "1rem",
                              fontFamily: CONTENT,
                            },
                          }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                      <Tooltip title="Your project will be private and only visible to you">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!publicStatus}
                              onChange={() => {
                                setPublicStatus(false);
                              }}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 25,
                                  color: "#496fab",
                                },
                                "&:hover .MuiSvgIcon-root": {
                                  color: "white",
                                  backgroundColor: "#334B71",
                                },
                              }}
                              disabled={project && userID !== project.userId}
                            />
                          }
                          label="Private"
                          sx={{
                            fontSize: "1rem",
                            "& .MuiTypography-root": {
                              fontSize: "1rem",
                              fontFamily: CONTENT,
                            },
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <div style={{ width: "100%", marginTop: "30px" }}>
                    {" "}
                    <Tooltip
                      title="Add a title to your project"
                      disableInteractive={false}
                    >
                      <div style={{ width: "100%" }}>
                        <CustomRoundedTextField
                          label="Project Name"
                          name="projectName"
                          value={projectName}
                          backgroundColor="#ffffc2"
                          borderRadius="30px"
                          colorOnFocus="black"
                          handleInputChange={handleProjectNameChange}
                          disabled={project && userID !== project.userId}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip
                      title="Add a brief description of your project"
                      disableInteractive={false}
                    >
                      <div style={{ width: "100%" }}>
                        <CustomRoundedTextField
                          label="Project Description"
                          name="projectDescription"
                          value={projectDescription}
                          backgroundColor="#ffffc2"
                          borderRadius="30px"
                          colorOnFocus="black"
                          handleInputChange={handleProjectDescriptionChange}
                          maxHeight="200px"
                          multiline={true}
                          maxLength={550}
                          disabled={project && userID !== project.userId}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip
                      title="You can add users with whom you want to collaborate on this project"
                      disableInteractive={false}
                    >
                      <div style={{ width: "100%" }}>
                        <AutomcompleteTextField
                          marginTop={3}
                          borderRadius="30px"
                          backgroundColor="#ffffc2"
                          outlineOnFocus="black"
                          labelColorOnFocus="black"
                          options={allUsers}
                          selectedOptions={collaboratos}
                          setSelectedOptions={setCollaborators}
                          objectProperty="username"
                          label="Add Collaborators"
                          disabled={project && userID !== project.userId}
                          //dropdownBgColor="#fcfcf0"
                          // dropdownTextColor="black"
                          // dropdownTextColorOnHover="white"
                          // dropdownBgColorOnHover="red"
                          // chipBgColor="#f0f0f0"
                          // chipTextColor="black"
                          // chipBorderColor="#363535"
                          // chipDeleteIconColor="#363535"
                          // chipBgColorOnHover="#363535"
                          // chipTextColorOnHover="white"
                          // chipDeleteIconColorOnHover="white"
                          // maxDropdownHeight={150}
                          // selectedBgColor = "#cccccc"
                          // selectedTextColor = "black"
                          // selectedBgColorOnHover = "#aaaaaa"
                          // selectedTextColorOnHover = "white"
                          // clearIconColor = "black"
                          // clearIconBgColor = "transparent"
                          // clearIconColorOnHover = "white"
                          // clearIconBgColorOnHover = "black"
                        />
                      </div>
                    </Tooltip>
                    <Tooltip
                      title="Select some tags that describes your projects (optionally add your custome tags by typing in)"
                      disableInteractive={false}
                    >
                      <div style={{ width: "100%" }}>
                        <AutomcompleteTextField
                          marginTop={3}
                          borderRadius="30px"
                          backgroundColor="#ffffc2"
                          outlineOnFocus="black"
                          labelColorOnFocus="black"
                          options={tagNames}
                          selectedOptions={suggestedTags}
                          setSelectedOptions={setSuggestedTags}
                          label="Add Tags"
                          disabled={project && userID !== project.userId}
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "30px",
                      marginBottom: "60px",
                      width: "100%",
                    }}
                  >
                    <CustomRoundedButton
                      disabled={isModalLoading || !screenshotUrl}
                      textColor={textColor}
                      textColorOnHover={textColorOnHover}
                      backgroundColor={buttonBackgroundColor}
                      backgroundColorOnHover={buttonBackgroundColorOnHover}
                      borderRadius={buttonBorderRadius}
                      label={
                        !projectID && !problemID
                          ? "CREATE"
                          : projectID && problemID === "null"
                          ? "UPDATE"
                          : "SUBMIT"
                      }
                      handleClick={() => {
                        if (screenshotUrl) {
                          // const link = document.createElement("a");
                          // link.download = "screenshot.png";
                          // link.href = screenshotUrl;
                          // link.click();
                          if (!projectID && !problemID) handleCreateProject();
                          else if (projectID && problemID === "null")
                            handleUpdateProject();
                        }
                      }}
                    />
                  </div>
                </div>
                <ScrollDownButton
                  id="save-configurations-container"
                  iconColor="#334B71"
                  iconBackgroundColor="#93db81"
                  iconColorOnHover="white"
                  iconBackgroundColorOnHover="#334B71"
                  tooltipLabel="Scroll Down"
                  //left="50%"
                />
              </Box>
            </Modal>
          </>
        {/* ))} */}
      {problemID && problemID !== "null" && (
        <Tooltip title={"Finished? Check Solution."}>
          <IconButton
            sx={{
              position: "absolute",
              top: 25,
              right: 25,
              zIndex: 500,
              color: "black",
              "&:hover": { color: "white", backgroundColor: "#334B71" },
            }} // Adjust positioning as needed
            onClick={() => {
              checkSolution(
                userID,
                problemID,
                complist.midAreaLists,
                setLoadingScreen,
              )
                .then((res) => {
                  if (res.result === "correct") {
                    setLevelCompleted(true);
                  } else {
                    setLevelCompleted(false);
                    setShowErrorMessage(true);
                  }
                })
                .catch((err) => {
                  console.log(err);
                })
            }}
          >
            <FaFlagCheckered />
          </IconButton>
        </Tooltip>
      )}
      {levelCompleted && <LevelCompleteScreen openState={true} />}
      {!levelCompleted && (
        <WrongSubmissionErrorMessage
          open={showErrorMessage}
          setOpen={setShowErrorMessage}
        />
      )}
      <MiniChatBot
        isCodeLoading={isCodeLoading}
        setIsCodeLoading={setIsCodeLoading}
        //isProblem={problemID && problemID !== null}
      />
    </div>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    complist: state.list,
    character: state.character,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialize_all_lists: (midAreaLists) =>
      dispatch(initializeAllLists(midAreaLists)),
    dummy_func: () => dispatch(dummy()),
    set_character_list: (characterList, activeCharacter) =>
      dispatch(setCharacterList(characterList, activeCharacter)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
