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

const ThinkWithTimer = ({
  character,
  list,
  update_component_value,
  comp_id,
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
      : ["", 0]; //gets an array

  const active =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
      : true;

  const [state, setState] = useState({
    show_msg: false,
    timer_message: initialValue[0],
    timer_for_msg: initialValue[1],
  });
  /* Display Think Message with Timer */
  const displayMessage = () => {
    const el = document.getElementById(`${character.active.id}-message-box`);
    const el2 = document.getElementById(`${character.active.id}-message-box1`);
    if (state.show_msg && state.character_id === character.active.id) {
      setState({ ...state, show_msg: false });
      el.style.display = "none";
      el2.style.display = "none";
      return;
    }
    setState({ ...state, show_msg: true });
    el.style.display = "inline-block";
    el.style.position = "relative";

    el2.style.display = "block";
    el2.style.position = "relative";

    el.innerHTML = state.timer_message;
    window.setTimeout(() => {
      setState({ ...state, show_msg: false });
      el.style.display = "none";
      el2.style.display = "none";
    }, state.timer_for_msg * 1000);
  };

  const handleChaneMessage = (e) => {
    e.target.value.length > 0 &&
      setState({ ...state, timer_message: e.target.value });

    update_component_value(midAreaListIndex, componentIndex, [
      e.target.value,
      state.timer_for_msg,
    ]);
  };

  const handleChangeTime = (e) => {
    parseInt(e.target.value) > 0 &&
      setState({ ...state, timer_for_msg: parseInt(e.target.value) });

    update_component_value(midAreaListIndex, componentIndex, [
      state.timer_message,
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
        className="rounded text-center bg-purple-700 p-2 my-3"
        style={{ display: "flex" }}
      >
        <div style={{ marginRight: "10px", marginLeft: "5px" }}>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Message</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="text"
              value={state.timer_message}
              onChange={handleChaneMessage}
            />
          </div>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Timer:</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={state.timer_for_msg}
              onChange={handleChangeTime}
            />
          </div>
          <div
            id={comp_id}
            className="flex flex-row flex-wrap text-center bg-purple-900 text-white px-2 py-1 my-2 text-sm cursor-pointer"
            onClick={() => displayMessage()}
          >
            {`Think ${state.timer_message}`}
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          {" "}
          <IconButton
            onClick={handleButtonClick}
            style={{
              backgroundColor: !clicked ? "#4CAF50" : "#F44336",
              color: "white",
              borderRadius: "50%",
              padding: "2px",
              fontSize: "5px",
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

export default connect(mapStateToProps, mapDispatchToProps)(ThinkWithTimer);
