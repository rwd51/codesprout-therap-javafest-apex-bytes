import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

//utils
import { saveAs } from "file-saver";
import { ChromePicker } from "react-color";
//import * as pyodide from 'pyodide';

//MUI
import {
  Slider,
  IconButton,
  Box,
  Popover,
  Grid,
  Tootltip,
  Tooltip,
} from "@mui/material";

//redux
import { connect } from "react-redux";
import { addList } from "../../redux/midarea/actions";
import { addCharacter } from "../../redux/character/actions";

//icons
import { LuRefreshCw } from "react-icons/lu";
import { IoMdColorFill } from "react-icons/io";
import { MdDraw } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { AiOutlineSelect } from "react-icons/ai";

//components
import SpriteCard from "../sprites/SpriteCard";
import Loading from "../../../../misc/Loading";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

//firebase
import { ref, listAll, getDownloadURL } from "firebase/storage";
import storage from "../../../../../firebase-config";

function DrawingBoard({character, add_character, add_list, handleClose}) {
  const pyodideRef = useRef(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  const [isErasing, setIsErasing] = useState(false);
  const isErasingRef = useRef(isErasing);
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("black");
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const canvasRef = useRef(null);

  const cumulativeInkArray = useRef([[], [], []]);

  useEffect(() => {
    // const initializePyodide = async () => {
    //   const pyodideInstance = await pyodide.loadPyodide();
    //   await pyodideInstance.loadPackage(['micropip']);
    //   await pyodideInstance.runPythonAsync(`
    //     import micropip
    //     await micropip.install('requests')
    //     await micropip.install('numpy')
    //   `);
    //   setPyodideInstance(pyodideInstance);
    // };
    // initializePyodide();
    const initializePyodide = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";
      script.async = true;
      script.onload = async () => {
        setIsPyodideLoading(true);
        console.log("Pyodide script loaded successfully"); // Debugging line
        try {
          pyodideRef.current = await window.loadPyodide(); // Set the Pyodide instance to the ref
          await pyodideRef.current.loadPackage(["micropip"]);
          await pyodideRef.current.runPythonAsync(`
            import micropip
            await micropip.install('requests')
            await micropip.install('numpy')
          `);
          console.log("Pyodide instance initialized"); // Debugging line
        } catch (error) {
          console.error("Error initializing Pyodide:", error); // Debugging line
        } finally {
          setIsPyodideLoading(false); // Set loading to false once initialization is complete
        }
      };
      script.onerror = () => {
        console.error("Failed to load the Pyodide script"); // Debugging line
      };
      document.body.appendChild(script);
    };
    initializePyodide();

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });
    canvas.backgroundColor = "white";
    canvas.renderAll();

    canvasRef.current.fabric = canvas;

    updateBrushSettings(canvas);

    canvas.on("path:created", (opt) => {
      const path = opt.path;
      const xArray = [];
      const yArray = [];
      const tArray = [];
      const timestamp = new Date().getTime();

      path.path.forEach((point) => {
        xArray.push(point[1]);
        yArray.push(point[2]);
        tArray.push(timestamp);
      });

      if (isErasingRef.current) {
        // Remove erased points from cumulativeInkArray
        removeErasedPoints(xArray, yArray);
      } else {
        // Add drawn points to cumulativeInkArray
        cumulativeInkArray.current[0].push(...xArray);
        cumulativeInkArray.current[1].push(...yArray);
        cumulativeInkArray.current[2].push(...tArray);
      }

      console.log("Cumulative ink array:", cumulativeInkArray.current);
      if (cumulativeInkArray.current[0].length !== 0) runPythonScript();

      //saveInkArrayToFile(cumulativeInkArray.current);
    });

    const removeErasedPoints = (xArray, yArray) => {
      const xData = cumulativeInkArray.current[0];
      const yData = cumulativeInkArray.current[1];
      const tData = cumulativeInkArray.current[2];

      xArray.forEach((x, index) => {
        const y = yArray[index];
        for (let i = 0; i < xData.length; i++) {
          if (
            Math.abs(xData[i] - x) < brushSize &&
            Math.abs(yData[i] - y) < brushSize
          ) {
            xData.splice(i, 1);
            yData.splice(i, 1);
            tData.splice(i, 1);
            i--; // Adjust index after removal
          }
        }
      });
    };

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    isErasingRef.current = isErasing; // Keep the ref updated with the latest state
    updateBrushSettings(canvasRef.current.fabric);
  }, [isErasing, brushSize, brushColor]);

  const updateBrushSettings = (canvas) => {
    const brush = new fabric.PencilBrush(canvas);
    brush.width = brushSize;
    brush.color = isErasing ? "white" : brushColor;
    canvas.freeDrawingBrush = brush;
  };

  const handleBrushSizeChange = (event, newValue) => {
    setBrushSize(newValue);
  };

  const handleColorChange = (color) => {
    setBrushColor(color.hex);
    setIsErasing(false); // Automatically switch to brush mode when changing color
  };

  const handleColorLensClick = (event) => {
    setColorPickerAnchor(event.currentTarget); // Open the color picker
  };

  const saveInkArrayToFile = (inkArray) => {
    const blob = new Blob([JSON.stringify(inkArray)], {
      type: "application/json",
    });
    saveAs(blob, "inkArray.json");
  };

  const clearAll = () => {
    const canvas = canvasRef.current.fabric;
    canvas.clear();
    canvas.backgroundColor = "white";
    canvas.renderAll();

    cumulativeInkArray.current = [[], [], []];
  };

  const saveAsSVG = () => {
    const canvas = canvasRef.current.fabric;
    const svg = canvas.toSVG(); // Convert the canvas content to SVG
    const blob = new Blob([svg], { type: "image/svg+xml" }); // Create a Blob for the SVG data
    saveAs(blob, "drawing.svg"); // Trigger download using file-saver
  };

  //sprite display management
  const [selectedSprite, setSelectedSprite] = useState(null);
  const allSpritesRef = useRef([]);

  const [_, setSuggestionsUpdated] = useState(false);

  // async function getMatchingSVGs(namesArray) {
  //   const storageRef = ref(storage, "sprites/autodraw/");
  //   const result = await listAll(storageRef);
  //   const matches = [];

  //   result.items.forEach((itemRef) => {
  //     const fileName = itemRef.name; // e.g., 'autodraw-magic wand-1.svg'
  //     namesArray.forEach((name) => {
  //       if (fileName.includes(name)) {
  //         const nameWithNumber = fileName
  //           .replace("autodraw-", "")
  //           .replace(".svg", "");
  //         const imgSrc = `autodraw/${fileName}`;
  //         matches.push({ name: nameWithNumber, imgSrc: imgSrc });
  //       }
  //     });
  //   });

  //   return matches;
  // }

  async function getMatchingSVGs(namesArray) {
    const storageRef = ref(storage, "sprites/autodraw/");
    const result = await listAll(storageRef);
    const matches = [];

    for (const name of namesArray) {
      let found = false;
      for (const itemRef of result.items) {
        const fileName = itemRef.name; // e.g., 'autodraw-magic wand-1.svg'
        if (fileName.split("-")[1] === name) {
          console.log("Found: " + name);
          found = true;
          const nameWithNumber = fileName
            .replace("autodraw-", "")
            .replace(".svg", "");
          const imgSrc = `autodraw/${fileName}`;
          matches.push({ name: nameWithNumber, imgSrc: imgSrc });
        } else if (found && !(fileName.split("-")[1] === name)) {
          break;
        }
      }
      if (found === false) console.log("Did not find: " + name);
    }

    return matches;
  }

  const handleAddSelectedSuggestion = () => {
    add_character(`autodraw-${selectedSprite.name}`);
    add_list(`sprite${character.characters.length - 1}`);

    handleClose();
  };

  const [isPythonScriptRunning, setIsPythonScriptRunning] = useState(false);

  const runPythonScript = async () => {
    if (!pyodideRef.current) {
      console.log("Pyodide instance is not ready");
      return;
    }

    setIsPythonScriptRunning(true);

    try {
      // Fetch the Python script file from the public folder
      const response = await fetch(
        `${window.location.origin}/scripts/autodraw/testGoogleHandwritingAPI.py`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch script: ${response.statusText}`);
      }

      const pythonScript = await response.text();
      if (!pythonScript) {
        throw new Error("Python script content is empty");
      }

      // Prepare the ink array for Python script
      const inkArrayStr = JSON.stringify(cumulativeInkArray.current);

      // // Fetch the JSON file that the Python script expects
      // const jsonResponse = await fetch(
      //   "./scripts/autodraw/stencils-20170414.json"
      // );
      // const jsonData = await jsonResponse.json();

      // Load the Python script into Pyodide
      await pyodideRef.current.runPythonAsync(pythonScript);

      // Run the Python function 'getSuggestions' with the ink array as argument
      const pythonCommand = `getSuggestions(${inkArrayStr})`;
      const result = await pyodideRef.current.runPythonAsync(pythonCommand);

      // Assuming the result is JSON serializable, parse it to use in JavaScript
      const formattedResult = result.toJs();
      console.log("Python script output:", formattedResult);

      getMatchingSVGs(formattedResult)
        .then((matches) => {
          allSpritesRef.current = matches;
          setSuggestionsUpdated((prev) => !prev);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });

      // Further processing can be done here if needed
      // e.g., updating the state with the results
      // allSpritesRef.current = formatPythonOutput(formattedResult);
      // setSuggestionsUpdated((prev) => !prev);
    } catch (error) {
      console.error("Error running Python script:", error);
    } finally {
      setIsPythonScriptRunning(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "500px",
        width: "100%",
        position: "relative",
      }}
    >
      {isPyodideLoading && (
        <div
          key={pyodideRef.current}
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            opacity: 0.7,
            width: "100%",
            height: "100%",
            zIndex: 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Loading
            spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
            sprinnerWidth="300px"
            spinnerHeight="300px"
            spinnerImageWidth="250px"
            spinnerImageHeight="250px"
            spinnerColor="#334B71"
            spinnerBackgroundColor="#ebfdff"
          />
        </div>
      )}
      <Box
        sx={{
          display: "flex",
          padding: 2,
          alignItems: "center",
          backgroundColor: "#e8f5fa",
          "&:hover": {
            backgroundColor: "#c0ebfa",
          },
        }}
      >
        <Tooltip
          title={
            isErasing ? "Change Eraser Thickness" : "Change Marker Thickness"
          }
        >
          <Slider
            min={1}
            max={30}
            value={brushSize}
            onChange={handleBrushSizeChange}
            aria-labelledby="brush-size-slider"
            orientation="vertical" // Set orientation to vertical
            style={{ height: "150px", marginTop: "10px" }} // Adjust height for vertical slider
            sx={{
              "& .MuiSlider-track": {
                backgroundColor: "#93db81", // Color of the slider track
              },
              "& .MuiSlider-thumb": {
                backgroundColor: "#334B71", // Color of the thumb (the draggable part)
              },
              "&:hover .MuiSlider-track": {
                backgroundColor: "#334B71", // Color of the slider track on hover
              },
              "&:hover .MuiSlider-thumb": {
                backgroundColor: "#93db81", // Color of the thumb on hover
              },
            }}
          />
        </Tooltip>
      </Box>
      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Align children to the center to avoid overflow
          padding: 2,
          backgroundColor: "#ffffd9",
          "&:hover": {
            backgroundColor: "#fcfcc2",
          },
        }}
      >
        <Tooltip title="Draw">
          <IconButton
            variant="contained"
            color="primary"
            onClick={() => setIsErasing(false)}
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px", // Ensure the button is circular by setting equal width and height
              height: "50px", // Ensure the button is circular by setting equal width and height
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0, // Remove padding
              color: "#334B71",
              backgroundColor: "#93db81",
              border: !isErasing ? "5px solid rgb(51, 75, 113, 0.5)" : "none",
              "&:hover": {
                backgroundColor: "#334B71", // Change background color on hover
                color: "white", // Change icon color on hover
                border: !isErasing
                  ? "5px solid rgb(147, 219, 129, 0.5)"
                  : "none",
              },
            }}
          >
            <MdDraw />
          </IconButton>
        </Tooltip>
        <Tooltip title="Erase">
          <IconButton
            variant="contained"
            color="primary"
            onClick={() => setIsErasing(true)}
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px", // Ensure the button is circular by setting equal width and height
              height: "50px", // Ensure the button is circular by setting equal width and height
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0, // Remove padding
              color: "#334B71",
              backgroundColor: "#93db81",
              border: isErasing ? "5px solid rgb(51, 75, 113, 0.5)" : "none",
              "&:hover": {
                backgroundColor: "#334B71", // Change background color on hover
                color: "white", // Change icon color on hover
                border: isErasing
                  ? "5px solid rgb(147, 219, 129, 0.5)"
                  : "none",
              },
            }}
          >
            <FaEraser />
          </IconButton>
        </Tooltip>

        <Tooltip title="Change Color">
          <IconButton
            aria-label="color picker"
            onClick={handleColorLensClick}
            disabled={isErasing}
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px", // Ensure the button is circular by setting equal width and height
              height: "50px", // Ensure the button is circular by setting equal width and height
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0, // Remove padding
              color: "#334B71",
              backgroundColor: "#93db81",
              "&:hover": {
                backgroundColor: "#334B71", // Change background color on hover
                color: "white", // Change icon color on hover
              },
              "&.Mui-disabled": {
                color: "#334B71",
                backgroundColor: "#f0f0f0",
                opacity: 0.7,
              },
            }}
          >
            <IoMdColorFill sx={{ color: brushColor }} />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(colorPickerAnchor)}
          anchorEl={colorPickerAnchor}
          onClose={() => setColorPickerAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <ChromePicker color={brushColor} onChange={handleColorChange} />
        </Popover>

        <Tooltip title="Clear All">
          <IconButton
            variant="contained"
            color="primary"
            onClick={clearAll}
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px", // Ensure the button is circular by setting equal width and height
              height: "50px", // Ensure the button is circular by setting equal width and height
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0, // Remove padding
              color: "#334B71",
              backgroundColor: "#93db81",
              "&:hover": {
                backgroundColor: "#334B71", // Change background color on hover
                color: "white", // Change icon color on hover
              },
            }}
          >
            <LuRefreshCw />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Your Current Drawing">
          <IconButton
            variant="contained"
            color="primary"
            onClick={saveAsSVG} // Reference the function you'll define next
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#334B71",
              backgroundColor: "#93db81",
              "&:hover": {
                backgroundColor: "#334B71",
                color: "white",
              },
              "&.Mui-disabled": {
                color: "#334B71",
                backgroundColor: "#f0f0f0",
                opacity: 0.7,
              },
            }}
            disabled={cumulativeInkArray.current[0].length === 0}
          >
            <MdSaveAlt />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Selected Suggestion">
          <IconButton
            variant="contained"
            color="primary"
            disabled={!selectedSprite}
            onClick={handleAddSelectedSuggestion} // Reference the function you'll define next
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#334B71",
              backgroundColor: "#93db81",
              "&:hover": {
                backgroundColor: "#334B71",
                color: "white",
              },
              "&.Mui-disabled": {
                color: "#334B71",
                backgroundColor: "#f0f0f0",
                opacity: 0.7,
              },
            }}
          >
            <AiOutlineSelect />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          position: "relative",
          border: "5px solid black",
          overflow: "hidden",
        }}
      >
        <canvas ref={canvasRef} width="500" height="500" />
      </Box>
      <Box
        sx={{
          width: "580px",
          //marginLeft: "20px",
          //flexGrow: 1,
          boxSizing: "border-box", // Ensure padding and borders are included in the box's width/height
          height: "100%", // Set the height of the Box to be the same as the Grid
          overflowY: "auto",
          backgroundColor: "#f0f0f0",
          "&:hover": {
            backgroundColor: "#f7f7eb",
          }, // Background color on hover
        }}
      >
        {isPythonScriptRunning && (
          <div
            key={pyodideRef.current}
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              opacity: 0.7,
              width: "580px",
              height: "100%",
              zIndex: 100,
            }}
            onClick={(e) => e.stopPropagation()}
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
        <Grid
          container
          spacing={2} // 1. Add spacing between grid items (you can adjust the value as needed)
          sx={{
            // Default background color
            height: "100%", // Make the grid take the full height of the Box
            width: "100%", // Make the grid take the full width of the Box
            borderRadius: "10px",
            display: "flex",
            marginTop: 0,
            marginLeft: 0,
            justifyContent: "center",
            padding: 2,
            flexWrap: "wrap", // 2. Allow items to wrap to the next line if there's no space
          }}
        >
          {allSpritesRef.current.map((sprite) => {
            return (
              <Grid item key={sprite.name}>
                <SpriteCard
                  sprite={sprite}
                  cardWidth={150}
                  cardHeight={200}
                  selectionArray={true}
                  selectedSprite={selectedSprite}
                  setSelectedSprite={setSelectedSprite}
                  // setDummySelectedSprite={setDummySelectedSprite}
                  // handleSetActive={handleSetActive}
                  // handleDelete={handleDelete}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    character: state.character,
  };
};

// mapping functions to components
const mapDispatchToProps = (dispatch) => {
  return {
    add_character: (spriteType) => dispatch(addCharacter(spriteType)),
    add_list: (character_id) => dispatch(addList(character_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawingBoard);
