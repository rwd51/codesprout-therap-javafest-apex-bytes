import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { addList, dummy } from "../redux/midarea/actions";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getComponent } from "./getComponents";
import { createStyles } from "@mui/material/styles";
import { makeStyles, withStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { purple } from "@mui/material/colors";
import Paper from "@mui/material/Paper";

import { Typography, Box } from "@mui/material";

//components
import Loading from "../../../misc/Loading";
import ScrollDownButton from "../../../misc/ScrollDownButton";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../../../values/Button";

//firebase
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../../../firebase-config";
import CustomRoundedButton from "../../../misc/CustomRoundedButton";

// Styling for MaterialUI Components
const useStyles = makeStyles(() =>
  createStyles({
    button: {
      margin: 0,
    },
    imageContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end", // Aligns the image container to the right
      alignItems: "center", // Centers the image vertically
    },
  })
);

// Customized button for Running Lists
const RunButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    fontSize: "13px",
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(Button);

// Mid Area Component
function Code({
  area_list,
  add_list,
  character,
  event_values,
  dummy_func,
  isCodeLoading,
}) {
  const classes = useStyles();
  const eventFire = (el, etype) => {
    if (el && el.fireEvent) {
      el.fireEvent("on" + etype);
    } else if (el) {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  };

  function flatten(componentsArray, idArg) {
    function processComponents(components, parentRepeatCompId) {
      let flattenedComponents = [];

      for (let index = 0; index < components.length; index++) {
        let component = components[index];

        if (component.id === "REPEAT") {
          // Process the 'REPEAT' block
          let timesToRepeat = component.values[0];
          let nestedComponents = component.values[1];

          // Generate the comp_id for the 'REPEAT' block
          let comp_id;

          if (parentRepeatCompId == null) {
            // For top-level 'REPEAT' blocks
            comp_id = `compREPEAT-${idArg}-${index}`;
          } else {
            // For nested 'REPEAT' blocks
            comp_id = `element-${parentRepeatCompId}-REPEAT.${index}`;
          }

          // Process the nested components once
          let nestedFlattened = processComponents(
            nestedComponents,
            comp_id // pass the comp_id of this 'REPEAT' block
          );

          // Repeat the nested components the specified number of times
          for (
            let repeatIndex = 0;
            repeatIndex < timesToRepeat;
            repeatIndex++
          ) {
            flattenedComponents = flattenedComponents.concat(nestedFlattened);
          }
        } else {
          // Process regular components
          // Generate the comp_id
          let comp_id;

          if (parentRepeatCompId == null) {
            // For top-level components
            comp_id = `comp${component.id}-${idArg}-${index}`;
          } else {
            // For components nested within a 'REPEAT' block
            comp_id = `element-${parentRepeatCompId}-${component.id}.${index}`;
          }

          // Create a copy of the component with the comp_id
          let componentCopy = { ...component, comp_id: comp_id };

          // Add to the flattenedComponents
          flattenedComponents.push(componentCopy);
        }
      }

      return flattenedComponents;
    }

    // Start processing from the top-level components
    return processComponents(componentsArray, null);
  }

  // Handle Running the list
  const handleClick = (arr, id) => {
    if (arr.length === 0) return;

    arr = flatten(arr, id);

    let i = 0;

    let repeat = 1;

    //let str1 = `comp${arr[i].id}-${id}-${i}`;
    let str1 = arr[i].comp_id;
    // Handle Wait at first index
    if (arr[i].active) {
      if (arr[i].id === "WAIT") {
        //let str2 = `comp${arr[i].id}-${id}-${i}`;
        let str2 = arr[i].comp_id;

        let last_time = new Date().getTime();
        let curr_time = new Date().getTime();

        while ((curr_time - last_time) / 1000 < event_values.wait[str2] - 2) {
          curr_time = new Date().getTime();
        }
      } else if (arr[i].id !== "REPEAT") {
        eventFire(document.getElementById(str1), "click");
      }

      // Handle Repeat at first index
      // else {
      //   repeat = event_values.repeat[str1] + 1;
      // }
    }
    i++;

    /* Each function execution takes 2 seconds */
    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      // Handle Wait
      if (arr[i]) {
        if (arr[i].id === "WAIT") {
          if (arr[i].active) {
            //let str2 = `comp${arr[i].id}-${id}-${i}`;
            let str2 = arr[i].comp_id;

            let last_time = new Date().getTime();
            let curr_time = new Date().getTime();

            while (
              (curr_time - last_time) / 1000 <
              event_values.wait[str2] - 2
            ) {
              curr_time = new Date().getTime();
            }
          }

          i++;
        }

        // Handle Repeat Component at current index
        // else if (arr[i].id === "REPEAT") {
        //   if (arr[i].active) {
        //     let str2 = `comp${arr[i].id}-${id}-${i}`;
        //     repeat = repeat * (event_values.repeat[str2] + 1);
        //   }

        //   i++;
        // }

        // // If Repeat component is at previous index
        // else if (arr[i].active && arr[i - 1].id === "REPEAT" && repeat > 2) {
        //   let str2 = `comp${arr[i].id}-${id}-${i}`;
        //   eventFire(document.getElementById(str2), "click");
        //   repeat--;
        // }
        else {
          if (arr[i].active) {
            //let str2 = `comp${arr[i].id}-${id}-${i}`;
            let str2 = arr[i].comp_id;
            eventFire(document.getElementById(str2), "click");
          }

          i++;
        }
      }
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dummy_func();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // to handle changing characters
  const [spriteUrl, setSpriteUrl] = useState("");
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadSprite = async () => {
      if (character.characters && character.characters.length > 0) {
        setIsLoading(true);

        const folder = String(character.active.type).startsWith("autodraw")
          ? "autodraw"
          : "svg";
        try {
          const url = await getDownloadURL(
            ref(storage, `sprites/${folder}/${character.active.type}.svg`)
          );
          setSpriteUrl(url);
        } catch (error) {
          console.error("Error fetching sprite image from Firebase:", error);
          setSpriteUrl(""); // Handle the case when the image fails to load
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSprite();
  }, [character.active]);

  //handle overflow of code-container
  const [isOverflowing, setIsOverflowing] = useState(false);
  const divRef = useRef(null);

  const checkOverflow = () => {
    if (divRef.current) {
      const hasOverflow =
        divRef.current.scrollHeight > divRef.current.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    // Clean up the observer on component unmount
    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
    };
  }, []);
  return (
    <div style={{ flex: 1, height: "100%", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            borderRadius: "4px",
            color: "white",
            backgroundColor: "#334B71",
            //padding: "3px",
            width: "auto",
            fontFamily: TITLE,
            paddingLeft: "20px",
            paddingRight: "20px",
            boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.6)",
          }}
        >
          Code
        </Typography>

        <div className={classes.imageContainer}>
          <Box
            sx={{
              borderRadius: "50%",
              padding: 1,
              backgroundColor: "white",
              border: "2px solid #334B71",
              "&:hover": {
                border: "5px solid rgb(51, 75, 113, 0.6)",
              },
            }}
          >
            {isloading ? (
              // Loading screen content
              <div
                style={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading
                  sprinnerWidth="50px"
                  spinnerHeight="50px"
                  spinnerColor="#334B71"
                  spinnerBackgroundColor="#ebfdff"
                />
              </div>
            ) : (
              // Image content
              <img
                src={spriteUrl || ``}
                alt={character.active ? `${character.active.type}` : ``}
                style={{ width: 50, height: 50, opacity: 0.5 }}
              />
            )}
          </Box>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          justifyContent: "center",
        }}
      >
        {area_list.midAreaLists.length > 0 &&
          area_list.midAreaLists.map(
            (l) =>
              character.active &&
              character.active.id === l.character_id && (
                <div
                  style={{
                    width: "288px",
                    //backgroundColor: "#f7f6e1",
                    border: "2px solid black",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.7)",
                  }}
                  key={l.id}
                >
                  <Paper
                    key={area_list.rendered}
                    elevation={3}
                    sx={{
                      position: "relative",
                      padding: "16px",
                      backgroundColor: "#faf8c3",
                      "&:hover": {
                        backgroundColor: "#f5f3a6",
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      {/* <RunButton
                        variant="contained"
                        className={classes.button}
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleClick(l.comps, l.id)}
                      >
                        Run{" "}
                      </RunButton> */}
                      <CustomRoundedButton
                        textColor={textColor}
                        textColorOnHover={textColorOnHover}
                        backgroundColor={buttonBackgroundColor}
                        backgroundColorOnHover={buttonBackgroundColorOnHover}
                        borderRadius={buttonBorderRadius}
                        label={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PlayArrowIcon />
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              RUN
                            </div>
                          </div>
                        }
                        handleClick={() => handleClick(l.comps, l.id)}
                      />
                    </div>

                    <div style={{ position: "relative" }}>
                      <Box
                        ref={divRef}
                        id="code-container"
                        sx={{
                          width: "250px",
                          border: "2px solid black",
                          padding: "8px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          overflowY: "auto",
                          maxHeight: "430px",
                          backgroundColor: "#fffc7d",
                          "&:hover": {
                            backgroundColor: "#f77e7e",
                          },
                        }}
                      >
                        <Droppable
                          droppableId={l.id}
                          type="COMPONENTS"
                          key={area_list.lastUpdated}
                          isDropDisabled={isCodeLoading}
                        >
                          {(provided) => (
                            <ul
                              style={{ width: "230px", height: "100%" }}
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <div
                                style={{
                                  textAlign: "center",
                                  margin: "8px auto",
                                  marginBottom: "16px",
                                }}
                              ></div>
                              {l.comps &&
                                l.comps.map((x, i) => {
                                  let str = x.id;
                                  let component_id = `comp${str}-${l.id}-${i}`;

                                  // console.log(str,component_id);
                                  return (
                                    <Draggable
                                      key={`${str}-${l.id}-${i}`}
                                      draggableId={`${str}-${l.id}-${i}`}
                                      index={i}
                                    >
                                      {(provided) => (
                                        <li
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          {getComponent(str, component_id, i)}
                                          {provided.placeholder}
                                        </li>
                                      )}
                                    </Draggable>
                                  );
                                })}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </Box>
                      {isOverflowing && (
                        <ScrollDownButton
                          id="code-container"
                          iconColor="#334B71"
                          iconBackgroundColor="#93db81"
                          iconColorOnHover="white"
                          iconBackgroundColorOnHover="#334B71"
                          tooltipLabel="Scroll Down"
                          //left="50%"
                        />
                      )}
                    </div>
                    {isCodeLoading && (
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#f0f0f0",
                          top: 0,
                          left: 0,
                          opacity: 0.7,
                          width: "100%",
                          height: "100%",
                          zIndex: 3000,
                          pointerEvents: "all",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Loading
                          spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                          sprinnerWidth="160px"
                          spinnerHeight="160px"
                          spinnerImageWidth="110px"
                          spinnerImageHefight="110px"
                          spinnerColor="#334B71"
                          spinnerBackgroundColor="#ebfdff"
                        />
                      </div>
                    )}
                  </Paper>
                </div>
              )
          )}
      </div>
    </div>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    area_list: state.list,
    event_values: state.event,
    character: state.character,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add_list: (character_id) => dispatch(addList(character_id)),
    dummy_func: () => dispatch(dummy()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Code);
