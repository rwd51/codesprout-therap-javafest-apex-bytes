import React, { useState } from "react";

//MUI
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import { updateActive } from "../../redux/midarea/actions";

const HideMessage = ({ character, comp_id, update_active, list }) => {
  const midAreaListIndex = comp_id
    ? parseInt(comp_id.split("-")[2])
    : list
    ? list.midAreaLists.length - 1
    : 0; //midAreaList0, midAreaList1, midAreaList2, ...
  const componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : 0;

  const active =
    midAreaListIndex !== undefined &&
    componentIndex !== undefined &&
    list.midAreaLists.length > 0
      ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
      : true;

  /* Hide Message */
  const displayMessage = () => {
    window.clearTimeout();
    const el = document.getElementById(`${character.active.id}-message-box`);
    const el2 = document.getElementById(`${character.active.id}-message-box1`);
    el.style.display = "none";
    el2.style.display = "none";
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
        id={comp_id}
        onClick={() => displayMessage()}
        style={{
          borderRadius: "4px",
          backgroundColor: "#6B21A8", // bg-purple-700
          textAlign: "center",
          color: "white",
          padding: "8px", // p-1
          margin: "12px auto", // my-3
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Ensures the button stays on the right
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "center" }}>Hide Message</div>

        <div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering `displayMessage` when the button is clicked
              handleButtonClick();
            }}
            style={{
              backgroundColor: clicked ? "#F44336" : "#4CAF50", // Toggle based on `clicked` state
              color: "white",
              borderRadius: "50%",
              padding: "2px",
              fontSize: "0.625rem", // Correcting previously incorrect size
            }}
          >
            {clicked ? (
              <CancelIcon style={{ fontSize: "16px" }} />
            ) : (
              <CheckCircleIcon style={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

// mapping state to props
const mapStateToProps = (state) => {
  return {
    character: state.character,
    list: state.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HideMessage);
