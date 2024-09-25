import React, { useState } from "react";
import { connect } from "react-redux";
import { setRepeat } from "../../redux/events/eventActions";
import Paper from "@mui/material/Paper";
import { Draggable , Droppable , DragDropContext} from "react-beautiful-dnd";

import {updateComponentValue } from "../../redux/midarea/actions";

////////
import {
  motionComponents
} from "../SidebarConstants"
import { getComponent } from "../getComponents";
////////




const Repeat = ({ comp_id, events, set_repeat , list, update_component_value}) => {
  const midAreaListIndex= comp_id ? parseInt(comp_id.split("-")[2]):
                                    list? (list.midAreaLists.length-1): undefined;//midAreaList0, midAreaList1, midAreaList2, ...
  const componentIndex= comp_id? parseInt(comp_id.split("-")[3]): undefined;

  const initialValue=(midAreaListIndex!==undefined && componentIndex!==undefined)? list.midAreaLists[midAreaListIndex].comps[componentIndex].values : [0,[]]  //gets an array
  
  const [repeat, setStateRepeat] = useState(initialValue[0]);
  //const [repeatComponents, setRepeatComponents] =useState(initialValue[1])
  const [repeatComponents, setRepeatComponents] =useState(    [
    {
      id: "MOVE",
      values: [0]
    },
    {
      id: "MOVE_Y",
      values: [0]
    },
    {
      id: "TURN_CLOCKWISE",
      values: [0]
    },
    {
      id: "TURN_ANTI_CLOCKWISE",
      values: [0]
    }
  ])

  // setRepeatComponents(
  //   [
  //     {
  //       id: "MOVE",
  //       values: [0]
  //     },
  //     {
  //       id: "MOVEY",
  //       values: [0]
  //     }
  //   ]
  // )


  // Set Repeat value for current component
  function handleChange(e) {
    let val = parseInt(e.target.value);
    setStateRepeat(val);
    let curr = events.repeat;
    curr[comp_id] = val;
    set_repeat(curr);

    update_component_value(midAreaListIndex,componentIndex,[parseInt(e.target.value),[]]);
  }


  //////
  const droppableId= comp_id? `element${comp_id}`: "REPEAT";

  console.log("Droppable ID: ",droppableId)


  const onDragEnd = (result) => {

  }
  /////


  return (
    // Repeat Component
    <Paper elevation={3}>
      <div className="rounded text-center bg-red-400 p-2 my-3">
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

        {/* <DragDropContext onDragEnd={onDragEnd}> */}
          {/* <Droppable droppableId={droppableId}>
            {(provided) => (
              <ul 
                className={`${droppableId} bg-gray-200 p-2 rounded`}  
                {...provided.droppableProps} 
                ref={provided.innerRef} 
              >
                {repeatComponents.map((x, i) => {
              return (
                <Draggable
                  key={`${droppableId}-${x.id}.${i}`}
                  draggableId={`${droppableId}-${x.id}.${i}`}
                  index={i}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="my-2"
                    >
                      {getComponent(x.id)}
                    </li>
                  )}
                </Draggable>
              );
            })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable> */}

                {/* Motion */}
      <Droppable droppableId={`${droppableId}`} type="COMPONENTS">
        {(provided) => (
          <ul
            className="sideArea-motion-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {repeatComponents.map((x, i) => {
              return (
                <Draggable
                  key={`${x.id}-sideArea-2`}
                  draggableId={`${x.id}-sideArea-2`}
                  index={i}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="my-2"
                    >
                      {getComponent(x.id)}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

        {/* </DragDropContext> */}

        <div
          id={comp_id}
          className="text-center bg-red-600 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        >
          Repeat By {repeat}
        </div>


      </div>
    </Paper>
  );
};

// map state to component
const mapStateToProps = (state) => {
  return {
    events: state.event,
    list: state.list
  };
};

// map function to component
const mapDispatchToProps = (dispatch) => {
  return {
    set_repeat: (value) => dispatch(setRepeat(value)),
    update_component_value: (midAreaListIndex,componentIndex, values)=> dispatch(updateComponentValue(midAreaListIndex,componentIndex,values))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Repeat);
