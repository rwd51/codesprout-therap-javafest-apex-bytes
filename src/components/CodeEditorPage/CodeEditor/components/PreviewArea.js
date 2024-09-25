import React, { useState, useRef, useEffect } from "react";

import GetSprite from "./sprites/GetSprite";
import { connect } from "react-redux";
import {
  addCharacter,
  setActive,
  setX,
  setY,
} from "../redux/character/actions";
import { addList } from "../redux/midarea/actions";

//MUI
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import { Typography } from "@mui/material";
import { createStyles } from "@mui/material/styles";
import { makeStyles, withStyles } from "@mui/styles";

//ss library
import html2canvas from "html2canvas";

// Styling for MaterialUI Components
const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button: {
      margin: 0,
    },
  })
);

//character component
function CharacterComponent({
  c,
  index,
  centerX,
  centerY,
  handleCharacterClick,
  dragMouseDown,
  drawCentralAxis,
  generateAngleVisualizer,
}) {
  const SpriteComponent = <GetSprite spriteType={c.type} charac_id={c.id} />; // Dynamically select sprite component based on type

  const [initialX, setInitialX] = useState(c.position.x);
  const [initialY, setInitialY] = useState(c.position.y);
  const hasMountedRef=useRef(false)
 
  useEffect(()=>{
    setInitialX(c.position.x)
    setInitialY(c.position.y) 
  },[])


  if (!SpriteComponent) {
    console.log("Sprite not found");
    return null;
  }
  return (
    <div
      id={`${c.id}-${index}`}
      key={index}
      //className={`absolute`}
      className={`absolute cursor-pointer`}
      style={{
        left: `${centerX + initialX}px`, // `${centerX + initialX}px`,
        top: `${centerY - initialY}px`, // `${centerY - initialY}px`,
        transform: "translate(-50%, -50%)", // Center the character on the coordinates
      }}
      onClick={() => handleCharacterClick(c.id, c.type)} // Click to make character active
      onMouseDown={(e) => dragMouseDown(e, `${c.id}-${index}`)}
    >
      <div id={`${c.id}-div`} className="character">
        <div
          className="hidden border-2 p-2 ml-3 mb-2 w-auto whitespace-normal"
          id={c.id + "-message-box"}
          style={{
            borderRadius: "30px",
            maxWidth: 150,
            wordWrap: "break-word",
            overflow: "hidden", // Maintains the design while allowing for expansion
          }}
        ></div>
        <div
          className="hidden rounded-full border-2 w-5 left-1/2 h-4 ml-3 mt-0 whitespace-nowrap"
          id={c.id + "-message-box1"}
        ></div>
        <div
          className="hidden rounded-full border-2 w-4 left-1/2 h-3 ml-0 mb-0 whitespace-nowrap"
          id={c.id + "-message-box2"}
        ></div>
        {c.showAngles && (
          <>
            <svg
              id={`${c.id}-axes`}
              width="200" // Width of the SVG
              height="200" // Height of the SVG
              style={{
                position: "absolute",
                //border: "2px solid red", // Helps in visualizing the SVG bounds
                left: "50%", // Centers horizontally relative to the container
                top: "50%", // Centers vertically relative to the container
                transform: "translate(-50%, -50%)", // Further centers the SVG at the desired position
                zIndex: 100,
              }}
            >
              {drawCentralAxis(200, 200)}
            </svg>
            <svg
              width="200" // Width of the SVG
              height="200" // Height of the SVG
              style={{
                position: "absolute",
                //border: "2px solid red", // Helps in visualizing the SVG bounds
                left: "50%", // Centers horizontally relative to the container
                top: "50%", // Centers vertically relative to the container
                transform: "translate(-50%, -50%)", // Further centers the SVG at the desired position
                zIndex: 100,
              }}
            >
              {generateAngleVisualizer(100, 100)}
            </svg>
          </>
        )}

        {SpriteComponent}
      </div>
    </div>
  );
}

function PreviewArea({
  character,
  add_character,
  add_list,
  previewArea,
  set_active,
  set_x,
  set_y,
}) {
  const classes = useStyles();
  const [active, setActive] = useState(character.active);

  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  let elmnt = null;

  /////

  // Function to handle setting active character by click

  function handleCharacterClick(id, type) {
    setActive(id); // Set active state locally
    set_active(id, type); // Dispatch Redux action to set active globally
  }
  /////

  function dragMouseDown(e, id) {
    elmnt = document.getElementById(id);

    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // Calculate the final position of the character
    const finalX =
      pos3 - previewAreaRef.current.getBoundingClientRect().left - centerX;
    const finalY = -(
      pos4 -
      previewAreaRef.current.getBoundingClientRect().top -
      centerY
    ); // Inverting Y-axis

    set_x(finalX);
    set_y(finalY);

    // Clean up
    document.onmouseup = null;
    document.onmousemove = null;
  }

  //for tooltip coordinate display
  const anchorEl = useRef(null);
  const previewAreaRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [popperPosition, setPopperPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showPerpendicularLines, setShowPerpendicularLines] = useState(false);
  const [perpendicularLinesPosition, setPerpendicularLinesPosition] = useState({
    x: 0,
    y: 0,
  });
  const axisOffset = 2;
  const dotOffset = 2;
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (previewAreaRef.current) {
        const rect = previewAreaRef.current.getBoundingClientRect();
        setCenterX(rect.width / 2);
        setCenterY(rect.height / 2);
      }
    };

    // Call once to set initial center
    handleResize();

    // Set up an event listener for resizing
    window.addEventListener("resize", handleResize);

    // Clean up listener
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount

  const handleMouseMove = (event) => {
    if (previewAreaRef.current) {
      const rect = previewAreaRef.current.getBoundingClientRect();
      const localCenterX = rect.width / 2;
      const localCenterY = rect.height / 2;
      setCenterX(localCenterX);
      setCenterY(localCenterY);

      setMousePosition({
        x: event.clientX - rect.left - localCenterX,
        y: -(event.clientY - rect.top - localCenterY), // Inverting the Y-axis
      });

      setPopperPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setPerpendicularLinesPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  ////////////////////

  // Function to generate ticks and labels for the axes
  const generateAxisTicks = (axis) => {
    const tickCount = 20; // Number of ticks on each side of the origin
    const ticks = [];
    const spacing = 20; // Spacing in pixels between ticks
    const interval = 20; // Numeric interval between ticks

    for (let i = -tickCount; i <= tickCount; i++) {
      if (i !== 0) {
        // Exclude the origin
        ticks.push(
          <div
            key={i}
            style={{
              position: "absolute",
              zIndex: "10",
              ...(axis === "x"
                ? {
                    top: "50%",
                    left: `calc(50% + ${i * spacing}px)`,
                    transform: "translate(-50%, -100%)",
                  }
                : {
                    left: "50%",
                    top: `calc(50% + ${-i * spacing}px)`,
                    transform: "translate(-100%, -50%)",
                  }),
            }}
          >
            <div
              style={{
                ...(axis === "x"
                  ? {
                      width: "1px",
                      height: "5px",
                      backgroundColor: "#666",
                    }
                  : {
                      height: "1px",
                      width: "5px",
                      backgroundColor: "#666",
                    }),
              }}
            ></div>
            <div
              style={{
                ...(axis === "x"
                  ? {
                      position: "absolute",
                      top: "6px",
                      left: "-50%",
                      textAlign: "center",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "7px",
                    }
                  : {
                      position: "absolute",
                      left: "6px",
                      top: "-50%",
                      textAlign: "center",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "7px",
                      writingMode: "vertical-lr",
                    }),
              }}
            >
              {i * interval}
            </div>
          </div>
        );
      }
    }

    return ticks;
  };

  const drawCentralAxis = (width, height) => {
    return (
      <>
        <line
          x1={width / 2}
          y1="0"
          x2={width / 2}
          y2={height}
          stroke="blue"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="red"
          strokeWidth="1"
        />
      </>
    );
  };

  const generateAngleVisualizer = (centerX, centerY, radius = 70) => {
    const angles = [];
    for (let angle = 0; angle < 360; angle += 10) {
      const radians = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(radians);
      const y = centerY - radius * Math.sin(radians);
      angles.push(
        <g key={angle}>
          <line
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke="#000"
            strokeWidth={1}
          />
          <text
            x={x + 5}
            y={y + 5}
            fontSize="10"
            style={{ userSelect: "none" }}
            transform={`rotate(${-angle}, ${x}, ${y})`}
          >
            {angle}°
          </text>
        </g>
      );
    }
    return angles;
  };

  return (
    <div
      className="w-full flex-none h-full overflow-y-auto p-3"
      id="preview_area"
      ref={previewAreaRef}
      onMouseMove={handleMouseMove} //for coordinate display function
      onMouseEnter={() => {
        setOpen(true);
        setShowPerpendicularLines(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
        setShowPerpendicularLines(false);
      }}
    >
      {previewArea.showAxes && (
        <>
          <div
            style={{
              //X axis
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "#000",
              zIndex: "10",
              "::after": {
                // CSS for arrowhead at the right end
                content: '""',
                position: "absolute",
                right: "0px",
                top: "-5px",
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "5px solid #000",
              },
            }}
          ></div>
          <div // Label for X-axis
            style={{
              position: "absolute",
              right: "10px",
              top: "46%",
              transform: "translateY(-50%)",
              fontFamily: "Arial, sans-serif",
              color: "#333",
            }}
          >
            X
          </div>

          <div
            style={{
              //Y axis
              position: "absolute",
              left: "50%",
              top: 0,
              height: "100%",
              width: "2px",
              backgroundColor: "#000",
              zIndex: "10",
              "::before": {
                // CSS for arrowhead at the top
                content: '""',
                position: "absolute",
                top: "0px",
                left: "-5px",
                borderBottom: "5px solid #000",
                borderRight: "5px solid transparent",
                borderLeft: "5px solid transparent",
              },
            }}
          ></div>
          <div // Label for Y-axis
            style={{
              position: "absolute",
              left: "53%",
              bottom: "10px",
              transform: "translateX(-50%)",
              fontFamily: "Arial, sans-serif",
              color: "#333",
            }}
          >
            Y
          </div>
          {/* Ticks for X-axis */}
          {generateAxisTicks("x")}

          {/* Ticks for Y-axis */}
          {generateAxisTicks("y")}
        </>
      )}

      {/* Conditional rendering of perpendicular lines */}
      {previewArea.showProjections && showPerpendicularLines && (
        <>
          {/* Vertical Line to X-axis */}
          <div
            style={{
              position: "absolute",
              left:
                centerX > perpendicularLinesPosition.x
                  ? `${perpendicularLinesPosition.x - axisOffset}px`
                  : `${perpendicularLinesPosition.x + axisOffset}px`,
              top:
                centerY > perpendicularLinesPosition.y
                  ? `${perpendicularLinesPosition.y - axisOffset}px`
                  : centerY,
              width: "1px",
              height: `${
                Math.abs(centerY - perpendicularLinesPosition.y) + axisOffset
              }px`,
              backgroundColor: "red",
              zIndex: "10",
            }}
          ></div>
          {/* Dot at the end of the vertical line */}
          <div
            style={{
              position: "absolute",
              left:
                centerX > perpendicularLinesPosition.x
                  ? `${perpendicularLinesPosition.x - axisOffset + 0.5}px`
                  : `${perpendicularLinesPosition.x + axisOffset + 0.5}px`,
              top: `${centerY}px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "red",
              transform: "translate(-50%, -50%)",
              opacity: 0.5,
              zIndex: "15",
            }}
          ></div>

          {/* Horizontal Line to Y-axis */}
          <div
            style={{
              position: "absolute",
              top:
                centerY > perpendicularLinesPosition.y
                  ? `${perpendicularLinesPosition.y - axisOffset}px`
                  : `${perpendicularLinesPosition.y + axisOffset}px`,
              left:
                centerX > perpendicularLinesPosition.x
                  ? `${perpendicularLinesPosition.x - axisOffset}px`
                  : centerX,
              height: "1px",
              width: `${
                Math.abs(centerX - perpendicularLinesPosition.x) + axisOffset
              }px`,
              backgroundColor: "blue",
              zIndex: "10",
            }}
          ></div>
          {/* Dot at the end of the horizontal line */}
          <div
            style={{
              position: "absolute",
              top:
                centerY > perpendicularLinesPosition.y
                  ? `${perpendicularLinesPosition.y - axisOffset + 2}px`
                  : `${
                      centerY +
                      Math.abs(centerY - perpendicularLinesPosition.y) +
                      2
                    }px`,
              left: `${centerX}px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "blue",
              transform: "translate(-50%, -50%)",
              opacity: 0.5,
              zIndex: "15",
            }}
          ></div>
        </>
      )}
      {previewArea.showCoordinates && (
        <Popper
          open={open}
          anchorEl={anchorEl.current}
          placement="top-start"
          style={{
            position: "fixed",
            top: `${popperPosition.y - 25}px`,
            left: `${popperPosition.x + 5}px`,
            pointerEvents: "none",
            backgroundColor: "#f0f0f0", // Light grey background
            border: "1px solid #ccc", // Light grey border
            borderRadius: "10px", // Rounded corners
            padding: "5px 10px", // Padding inside the tooltip
            fontSize: "10px", // Smaller font size
            fontFamily: "Arial, sans-serif", // Nice and clean font
            color: "#333", // Dark grey text for better readability
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)", // Subtle shadow for depth
          }}
        >
          <div>
            X: {mousePosition.x}, Y: {mousePosition.y}
          </div>
        </Popper>
      )}
      <div className="flex justify-around h-full">
        {character.characters &&
          character.characters.length > 0 &&
          character.characters.map((x, i) => {
            return (
              <CharacterComponent
                c={x}
                index={i}
                centerX={centerX}
                centerY={centerY}
                handleCharacterClick={handleCharacterClick}
                dragMouseDown={dragMouseDown}
                generateAngleVisualizer={generateAngleVisualizer}
                drawCentralAxis={drawCentralAxis}
              />
            );
            // const SpriteComponent = (
            //   <GetSprite spriteType={x.type} charac_id={x.id} />
            // ); // Dynamically select sprite component based on type

            // const initialX = x.position.x;
            // const initialY = x.position.y;

            // if (!SpriteComponent) {
            //   console.log("Sprite not found")
            //   return null;
            // }
            // return (
            //   <div
            //     id={`${x.id}-${i}`}
            //     key={i}
            //     //className={`absolute`}
            //     className={`absolute cursor-pointer`}
            //     style={{
            //       left: `${centerX}px`, // `${centerX + initialX}px`,
            //       top: `${centerY}px`, // `${centerY - initialY}px`,
            //       transform: "translate(-50%, -50%)", // Center the character on the coordinates
            //     }}
            //     onClick={() => handleCharacterClick(x.id, x.type)} // Click to make character active
            //     onMouseDown={(e) => dragMouseDown(e, `${x.id}-${i}`)}
            //   >
            //     <div id={`${x.id}-div`} className="character">
            //       <div
            //         className="hidden border-2 p-2 ml-3 mb-2 w-auto whitespace-normal"
            //         id={x.id + "-message-box"}
            //         style={{
            //           borderRadius: "30px",
            //           maxWidth: 150,
            //           wordWrap: "break-word",
            //           overflow: "hidden", // Maintains the design while allowing for expansion
            //         }}
            //       ></div>
            //       <div
            //         className="hidden rounded-full border-2 w-5 left-1/2 h-4 ml-3 mt-0 whitespace-nowrap"
            //         id={x.id + "-message-box1"}
            //       ></div>
            //       <div
            //         className="hidden rounded-full border-2 w-4 left-1/2 h-3 ml-0 mb-0 whitespace-nowrap"
            //         id={x.id + "-message-box2"}
            //       ></div>
            //       {x.showAngles && (
            //         <>
            //           <svg
            //             id={`${x.id}-axes`}
            //             width="200" // Width of the SVG
            //             height="200" // Height of the SVG
            //             style={{
            //               position: "absolute",
            //               //border: "2px solid red", // Helps in visualizing the SVG bounds
            //               left: "50%", // Centers horizontally relative to the container
            //               top: "50%", // Centers vertically relative to the container
            //               transform: "translate(-50%, -50%)", // Further centers the SVG at the desired position
            //               zIndex: 100,
            //             }}
            //           >
            //             {drawCentralAxis(200, 200)}
            //           </svg>
            //           <svg
            //             width="200" // Width of the SVG
            //             height="200" // Height of the SVG
            //             style={{
            //               position: "absolute",
            //               //border: "2px solid red", // Helps in visualizing the SVG bounds
            //               left: "50%", // Centers horizontally relative to the container
            //               top: "50%", // Centers vertically relative to the container
            //               transform: "translate(-50%, -50%)", // Further centers the SVG at the desired position
            //               zIndex: 100,
            //             }}
            //           >
            //             {generateAngleVisualizer(100, 100)}
            //           </svg>
            //         </>
            //       )}

            //       {SpriteComponent}
            //     </div>
            //   </div>
            // );
          })}
      </div>
    </div>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    character: state.character,
    previewArea: state.previewArea,
  };
};

// mapping functions to components
const mapDispatchToProps = (dispatch) => {
  return {
    add_character: (spriteType) => dispatch(addCharacter(spriteType)),
    set_active: (ch_id, type) => dispatch(setActive(ch_id, type)),
    set_x: (x) => dispatch(setX(x)),
    set_y: (y) => dispatch(setY(y)),
    add_list: (character_id) => dispatch(addList(character_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewArea);
