import React, { useState } from "react";

//MUI
import RedoIcon from "@mui/icons-material/Redo";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import { setCharacterAngle } from "../../redux/character/actions";
import {
  updateComponentValue,
  updateActive,
} from "../../redux/midarea/actions";

const TurnClockWise = ({
  character,
  characterAngle,
  list,
  update_component_value,
  comp_id,
  update_active,
}) => {
  // const midAreaListIndex = comp_id
  //   ? parseInt(comp_id.split("-")[2])
  //   : list
  //   ? list.midAreaLists.length - 1
  //   : 0; //midAreaList0, midAreaList1, midAreaList2, ...
  // const componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : 0;

  // const initialValue =
  //   midAreaListIndex !== undefined &&
  //   componentIndex !== undefined &&
  //   list.midAreaLists.length > 0
  //     ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
  //     : [0]; //gets an array

  // const active =
  //   midAreaListIndex !== undefined &&
  //   componentIndex !== undefined &&
  //   list.midAreaLists.length > 0
  //     ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
  //     : true;


  let midAreaListIndex, initialValue, componentIndex, active;

  if (!String(comp_id).startsWith("element")) {
    midAreaListIndex = comp_id
      ? parseInt(comp_id.split("-")[2])
      : list
      ? list.midAreaLists.length - 1
      : undefined; //midAreaList0, midAreaList1, midAreaList2, ...
    componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : undefined;

    initialValue =
      midAreaListIndex !== undefined &&
      componentIndex !== undefined &&
      list.midAreaLists.length > 0
        ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
        : [0]; //gets an array

    active =
      midAreaListIndex !== undefined &&
      componentIndex !== undefined &&
      list.midAreaLists.length > 0
        ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
        : true;
  } else {
    const arr = String(comp_id).split("-");

    midAreaListIndex = parseInt(arr[3], 10);
    const outermostRepeatBlockIndex = parseInt(arr[4], 10);

    componentIndex = [outermostRepeatBlockIndex];
    for (let i = 5; i < arr.length; i++) {
      // Split on the dot and take the second element which should be a number
      const index = arr[i].split(".")[1];
      if (index !== undefined) {
        componentIndex.push(parseInt(index, 10));
      }
    }

    const currentList = list.midAreaLists[midAreaListIndex].comps;

    let comp = currentList[componentIndex[0]].values[1];
    for (let i = 1; i < componentIndex.length - 1; i++) {
      comp = currentList[componentIndex[i]].values[1];
    }
    // console.log(comp)
    initialValue = comp[componentIndex[componentIndex.length - 1]].values;
    active = comp[componentIndex[componentIndex.length - 1]].active;
  }

  

  const [angle, setAngle] = useState(initialValue[0]);

  // handle turn clockwise component
  const handleClick = () => {
    const el = document.getElementById(character.active.id);
    const el_axes = document.getElementById(`${character.active.id}-axes`);
    const character_angle = character.characters.find(
      (x) => x.id === character.active.id
    );
    if (character_angle) {
      el.style.transition = "transform 1.5s ease-out";
      if(el_axes) el_axes.style.transition = "transform 1.5s ease-out";

      el.style.transform = `rotate(${character_angle.angle + angle}deg)`;
      if(el_axes) el_axes.style.transform = `translate(-50%, -50%) rotate(${
        character_angle.angle + angle
      }deg)`;
      characterAngle(character_angle.angle + angle);
    }
  };

  const handleChange = (e) => {
    setAngle(parseInt(e.target.value));

    update_component_value(midAreaListIndex, componentIndex, [
      parseInt(e.target.value),
    ]);
  };

  const [clicked, setClicked] = useState(!active);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    update_active(midAreaListIndex, componentIndex, clicked);
    setClicked(!clicked);
  };

  return (
    <Paper elevation={3}>
      <div
        className="text-center rounded bg-blue-500 p-2 my-3"
        style={{ display: "flex" }}
      >
        <div style={{ marginRight: "10px", marginLeft: "5px" }}>
          <div className="grid grid-cols-2">
            <div className="text-white">Rotate By:</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={angle}
              onChange={handleChange}
            />
          </div>
          <div
            id={comp_id}
            className={`flex bg-blue-700 text-white px-2 py-1 mt-3 mb-1 text-sm cursor-pointer text-center`}
            onClick={() => handleClick()}
          >
            <div className="flex mx-auto">
              Turn
              <RedoIcon className="mx-2" /> {angle} degrees
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          {" "}
          {/* New div to align button to the right */}
          <IconButton
            onClick={handleButtonClick}
            style={{
              backgroundColor: !clicked ? "#4CAF50" : "#F44336", // Green when clicked, Red otherwise
              color: "white",
              borderRadius: "50%",
              padding: "2px", // Reduced padding for a smaller button
              fontSize: "5px", // Reduced icon size
            }}
          >
            {!clicked ? (
              <CheckCircleIcon style={{ fontSize: "16px" }} />
            ) : (
              <CancelIcon style={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

// mapping state to component
const mapStateToProps = (state) => {
  return {
    character: state.character,
    list: state.list,
  };
};

// mapping function to component
const mapDispatchToProps = (dispatch) => {
  return {
    characterAngle: (angle) => dispatch(setCharacterAngle(angle)),
    update_component_value: (midAreaListIndex, componentIndex, values) =>
      dispatch(updateComponentValue(midAreaListIndex, componentIndex, values)),
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TurnClockWise);
