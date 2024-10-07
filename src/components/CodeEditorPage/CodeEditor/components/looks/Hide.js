import React, { useState } from "react";

//MUI
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import { updateActive } from "../../redux/midarea/actions";

const Hide = ({ character, comp_id, list, update_active }) => {
  // const midAreaListIndex = comp_id
  //   ? parseInt(comp_id.split("-")[2])
  //   : list
  //   ? list.midAreaLists.length - 1
  //   : 0; //midAreaList0, midAreaList1, midAreaList2, ...
  // const componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : 0;

  // const active =
  // midAreaListIndex !== undefined &&
  // componentIndex !== undefined &&
  // list.midAreaLists.length > 0
  //   ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
  //   : true;

  let midAreaListIndex, initialValue, componentIndex, active;

  if (!String(comp_id).startsWith("element")) {
    midAreaListIndex = comp_id
      ? parseInt(comp_id.split("-")[2])
      : list
      ? list.midAreaLists.length - 1
      : undefined; //midAreaList0, midAreaList1, midAreaList2, ...
    componentIndex = comp_id ? parseInt(comp_id.split("-")[3]) : undefined;

    // initialValue =
    //   midAreaListIndex !== undefined &&
    //   componentIndex !== undefined &&
    //   list.midAreaLists.length > 0
    //     ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
    //     : []; //gets an array

    initialValue = [];

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

  // To handle hide component
  const handleDisplay = () => {
    const el = document.getElementById(character.active.id);
    el.style.display = "none";
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
        onClick={() => Hide()}
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
        <div style={{ flexGrow: 1, textAlign: "center" }}>Hide</div>

        <div>
          <IconButton
            onClick={(e) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Hide);
