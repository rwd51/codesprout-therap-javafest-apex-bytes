import React, { useEffect, useState } from "react";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

//MUI
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//redux
import { connect } from "react-redux";
import { setRepeat } from "../../redux/events/eventActions";
import {
  updateComponentValue,
  updateActive,
  initializeAllLists,
} from "../../redux/midarea/actions";

//components
import { getComponent } from "../getComponents";

const Repeat = ({
  comp_id,
  events,
  set_repeat,
  list,
  update_component_value,
  update_active,
  event_values,
  //i,
}) => {
  //console.log(comp_id);
  //comp_id && console.log(comp_id);

  // const midAreaListIndex = comp_id
  //   ? parseInt(String(comp_id).split("-")[2])
  //   : list
  //   ? list.midAreaLists.length - 1
  //   : undefined; // midAreaList0, midAreaList1, midAreaList2, ...

  // //console.log(midAreaListIndex);

  // const componentIndex = comp_id
  //   ? parseInt(String(comp_id).split("-")[3])
  //   : undefined;

  // componentIndex && console.log(componentIndex);

  // const initialValue =
  //   midAreaListIndex !== undefined && componentIndex !== undefined
  //     ? list.midAreaLists[midAreaListIndex].comps[componentIndex].values
  //     : [0, []]; // gets an array

  // const active =
  //   midAreaListIndex !== undefined &&
  //   componentIndex !== undefined &&
  //   list.midAreaLists.length > 0
  //     ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
  //     : true;

  let midAreaListIndex, initialValue, componentIndex, active;

  if (!String(comp_id).startsWith("element")) {
    //console.log("bruh1");

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
        : [0, []]; //gets an array

    //console.log(list.midAreaLists);
    // console.log(
    //   i,
    //   midAreaListIndex,
    //   componentIndex,
    //   list.midAreaLists,
    //   list.midAreaLists[midAreaListIndex].comps[componentIndex]
    // );
    // console.log(
    //   i,
    //   midAreaListIndex !== undefined &&
    //     componentIndex !== undefined &&
    //     list.midAreaLists.length > 0
    // );

    active =
      midAreaListIndex !== undefined &&
      componentIndex !== undefined &&
      list.midAreaLists.length > 0
        ? list.midAreaLists[midAreaListIndex].comps[componentIndex].active
        : true;

    //console.log(midAreaListIndex, componentIndex, initialValue, active);
  } else {
    //console.log("bruh2");

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

  // console.log(
  //   i,
  //   comp_id,
  //   midAreaListIndex,
  //   componentIndex,
  //   initialValue,
  //   active
  // );

  //console.log(active);

  const [repeat, setStateRepeat] = useState(parseInt(initialValue[0]));
  const [repeatComponents, setRepeatComponents] = useState(initialValue[1]);

  //console.log(initialValue[0], initialValue[1]);

  // Set Repeat value for current component
  function handleChange(e) {
    let val = parseInt(e.target.value);
    setStateRepeat(val);
    let curr = events.repeat;
    curr[comp_id] = val;
    set_repeat(curr);

    update_component_value(midAreaListIndex, componentIndex, [
      parseInt(e.target.value),
      repeatComponents,
    ]);
  }

  const droppableId = comp_id ? `element-${comp_id}` : "REPEAT";

  const [clicked, setClicked] = useState(!active);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    update_active(midAreaListIndex, componentIndex, clicked);
    setClicked(!clicked);
  };



  return (
    <Paper elevation={3}>
      <div
        className="rounded text-center bg-orange-400 p-2 my-3"
        style={{ display: "flex" }}
      >
        <div style={{ marginRight: "10px", marginLeft: "5px" }}>
          <div className="grid grid-cols-2 my-2">
            <div className="text-white">Repeat</div>
            <input
              className="mx-2 p-1 py-0 text-center"
              type="number"
              value={repeat}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

          {comp_id && (
            <Droppable droppableId={droppableId} type="COMPONENTS">
              {(provided, snapshot) => (
                <ul
                  className={`${droppableId} bg-gray-200 p-2 rounded`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? "blue" : "grey",
                    padding: 4,
                    width: "calc(100% - 1px)",
                    minHeight: 100, // Ensuring there's enough space
                  }}
                >
                  {repeatComponents.map((x, i) => {
                    const comp_id = `${droppableId}-${x.id}.${i}`;
                    // console.log(x);
                    // console.log(x.id, comp_id);
                    return (
                      <Draggable key={comp_id} draggableId={comp_id} index={i}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="my-2"
                          >
                            {getComponent(x.id, comp_id)}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          )}

          <div
            id={comp_id}
            className="text-center bg-orange-600 text-white px-2 py-1 my-2 text-sm cursor-pointer"
          >
            Repeat By {repeat}
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
    event_values: state.event,
  };
};

// map function to component
const mapDispatchToProps = (dispatch) => {
  return {
    set_repeat: (value) => dispatch(setRepeat(value)),
    update_component_value: (midAreaListIndex, componentIndex, values) =>
      dispatch(updateComponentValue(midAreaListIndex, componentIndex, values)),
    update_active: (midAreaListIndex, componentIndex, active) =>
      dispatch(updateActive(midAreaListIndex, componentIndex, active)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Repeat);
