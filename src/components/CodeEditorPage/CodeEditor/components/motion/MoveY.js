import React, { useState } from "react";

//MUI
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import {
  updateComponentValue,
  updateActive,
} from "../../redux/midarea/actions";
import { setY } from "../../redux/character/actions";

// Move Component for Sidebar
const MoveY = ({
  character,
  list,
  update_component_value,
  update_active,
  comp_id,
  set_y,
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

  
  const [steps, setSteps] = useState(initialValue[0]);

  // Function used for moiving Sprint in Y direction
  const handleClick = () => {
    const el = document.getElementById(`${character.active.id}-div`);

    var top = el.offsetTop;
    el.style.position = "relative";
    el.style.transition = "top 1.2s ease-in-out";
    el.style.top = top - steps + "px";

    set_y(character.active.position.y + steps, true);
  };

  const handleChange = (e) => {
    setSteps(parseInt(e.target.value));

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
    <Paper elevation={3} style={{ margin: "10px auto" }}>
      <div
        id={comp_id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "blue", // Equivalent to bg-blue-700
          color: "white", // Text color
          padding: "10px", // Equivalent to p-3
          borderRadius: "5px", // Equivalent to rounded
          margin: "8px 0", // Equivalent to my-2
          cursor: "pointer",
          textAlign: "center", // Equivalent to text-center
          fontSize: "0.875rem", // Equivalent to text-sm
        }}
        onClick={() => handleClick()}
      >
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Move Y{" "}
          <input
            type="number"
            className="text-black text-center w-16 mx-2"
            value={steps}
            onChange={handleChange}
          />{" "}
          steps
        </div>
        <div style={{ marginLeft: "auto" }}>
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

const mapDispatchToProps = (dispatch) => {
  return {
    update_component_value: (midAreaListIndex, componentIndex, values) =>
      dispatch(updateComponentValue(midAreaListIndex, componentIndex, values)),
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
    set_y: (y, run) => dispatch(setY(y, run)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveY);
