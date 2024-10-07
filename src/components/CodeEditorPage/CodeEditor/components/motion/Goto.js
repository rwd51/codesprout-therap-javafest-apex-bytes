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
import { setX, setY } from "../../redux/character/actions";

const GotoXY = ({
  character,
  list,
  update_component_value,
  comp_id,
  set_x,
  set_y,
  update_active,
}) => {
  console.log(comp_id)
  const midAreaListIndex = comp_id
    ? parseInt(comp_id.split("-")[2])
    : list
    ? list.midAreaLists.length - 1
    : 0; //midAreaList0, midAreaList1, midAreaList2, ...
  const componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : 0;

  console.log(midAreaListIndex, componentIndex)

  console.log(list.midAreaLists[midAreaListIndex].comps[componentIndex].values);


  const initialValue =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
      : [0, 0]; //gets an array

  const active =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
      : true;

  const [state, setState] = useState({
    goto_x: initialValue[0],
    goto_y: initialValue[1],
  });

  // go to posiiton X and Y
  const gotoXY = () => {
    const el = document.getElementById(`${character.active.id}-div`);

    el.style.position = "relative";
    var left = el.offsetLeft;
    var top = el.offsetTop;

    el.style.transition = "left 1.2s ease-in-out, top 1.2s ease-in-out";

    el.style.left = left + state.goto_x + "px";
    el.style.top = top - state.goto_y + "px";

    set_x(character.active.position.x + state.goto_x, true);
    set_y(character.active.position.y + state.goto_y, true);
  };

  const handleChangeX = (e) => {
    parseInt(e.target.value) !== 0 &&
      setState({ ...state, goto_x: parseInt(e.target.value) });

    update_component_value(midAreaListIndex, componentIndex, [
      parseInt(e.target.value),
      state.goto_y,
    ]);
  };

  const handleChangeY = (e) => {
    parseInt(e.target.value) !== 0 &&
      setState({ ...state, goto_y: parseInt(e.target.value) });

    update_component_value(midAreaListIndex, componentIndex, [
      state.goto_x,
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
          <div className="grid grid-cols-2 my-2">
            <div className="text-white"> X </div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={state.goto_x}
              onChange={handleChangeX}
            />
          </div>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Y</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={state.goto_y}
              onChange={handleChangeY}
            />
          </div>
          <div
            id={comp_id}
            className="text-center bg-blue-700 text-white px-2 py-1 my-2 text-sm cursor-pointer"
            onClick={() => gotoXY()}
          >
            Go to X : {state.goto_x} Y : {state.goto_y}
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
    set_x: (x, run) => dispatch(setX(x, run)),
    set_y: (y, run) => dispatch(setY(y, run)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GotoXY);
