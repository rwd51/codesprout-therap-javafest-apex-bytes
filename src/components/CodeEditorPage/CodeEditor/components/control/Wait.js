import React, { useState } from "react";

//MUI
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import { setWait } from "../../redux/events/eventActions";
import {
  updateComponentValue,
  updateActive,
} from "../../redux/midarea/actions";

const Wait = ({
  events,
  comp_id,
  set_wait,
  list,
  update_component_value,
  update_active,
}) => {
  const midAreaListIndex = comp_id
    ? parseInt(comp_id.split("-")[2])
    : list
    ? list.midAreaLists.length - 1
    : 0; //midAreaList0, midAreaList1, midAreaList2, ...
  const componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : 0;

  const initialValue =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
      : [0]; //gets an array

  const active =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
      : true;

  const [wait, setStateWait] = useState(initialValue[0]);

  // Set Wait value for current component
  function handleChange(e) {
    let val = parseInt(e.target.value);
    setStateWait(val);
    let curr = events.wait;
    curr[comp_id] = val;
    set_wait(curr);

    update_component_value(midAreaListIndex, componentIndex, [
      parseInt(e.target.value),
    ]);
  }

  const [clicked, setClicked] = useState(!active);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    update_active(midAreaListIndex, componentIndex, clicked);
    setClicked(!clicked);
  };

  return (
    // Wait Component
    <Paper elevation={3}>
      <div
        className=" text-center rounded bg-red-400 p-2 my-3"
        style={{ display: "flex" }}
      >
        <div style={{ marginRight: "10px", marginLeft: "5px" }}>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Wait</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={wait}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div
            id={comp_id}
            className="text-center bg-red-600 text-white px-2 py-1 my-2 text-sm cursor-pointer"
          >
            Wait {wait} seconds
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

// map state to component
const mapStateToProps = (state) => {
  return {
    events: state.event,
    list: state.list,
  };
};

// map function to component
const mapDispatchToProps = (dispatch) => {
  return {
    set_wait: (value) => dispatch(setWait(value)),
    update_component_value: (midAreaListIndex, componentIndex, values) =>
      dispatch(updateComponentValue(midAreaListIndex, componentIndex, values)),
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wait);
