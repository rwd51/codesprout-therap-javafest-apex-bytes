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

const SayMessage = ({
  character,
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
  //     : [""]; //gets an array

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
        : [""]; //gets an array

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



  const [state, setState] = useState({
    show_msg: false,
    message: initialValue[0],
    character_id: "",
  });
  /* Display Message */
  const displayMessage = () => {
    const el = document.getElementById(`${character.active.id}-message-box`);
    const el2 = document.getElementById(`${character.active.id}-message-box1`);

    if (state.show_msg && state.character_id === character.active.id) {
      setState({ ...state, show_msg: false });
      el.style.display = "none";
      return;
    }
    setState({ ...state, show_msg: true });
    el.style.display = "block";
    el.style.position = "relative";

    el2.style.display = "none";

    window.clearTimeout();
    el.innerHTML = state.message;
  };

  const handleChange = (e) => {
    e.target.value.length > 0 &&
      setState({ ...state, message: e.target.value });

    update_component_value(midAreaListIndex, componentIndex, [e.target.value]);
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
        className="rounded text-center bg-purple-500 p-2 my-3"
        style={{ display: "flex" }}
      >
        <div style={{ marginRight: "10px", marginLeft: "5px" }}>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Message</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="text"
              value={state.message}
              onChange={handleChange}
            />
          </div>
          <div
            id={comp_id}
            className="flex text-center flex-row flex-wrap bg-purple-700 text-white px-2 py-1 my-2 text-sm cursor-pointer"
            onClick={() => displayMessage()}
          >
            {`Say ${state.message}`}
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

const mapDispatchToProps = (dispatch) => {
  return {
    update_component_value: (midAreaListIndex, componentIndex, values) =>
      dispatch(updateComponentValue(midAreaListIndex, componentIndex, values)),
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SayMessage);
