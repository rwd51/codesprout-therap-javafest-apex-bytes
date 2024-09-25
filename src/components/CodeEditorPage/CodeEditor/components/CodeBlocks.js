import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { getComponent } from "./getComponents";
import {
  motionComponents,
  looksComponents,
  controlComponents,
  eventsComponents,
} from "./CodeBlocksConstants";

import { Typography } from "@mui/material";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../../../values/Fonts";

// export default function CodeBlocks() {
//   const [motion, setMotion] = useState(motionComponents);
//   const [looks, setLooks] = useState(looksComponents);
//   const [control, setControl] = useState(controlComponents);
//   const [events, setEvents] = useState(eventsComponents);
//   const [refreshKey, setRefreshKey] = useState(0); // State variable to trigger re-render

//     useEffect(() => {
//     const timer = setTimeout(() => {
//       setRefreshKey((prevKey) => prevKey + 1);
//       console.log("bro")
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []); // Empty dependency array to run only once

//   return (
//     <div
//       id="code-blocks-container"
//       style={{
//         width: "270px",
//         flexShrink: 0,
//         height: "100%",
//         overflowY: "auto",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "start",
//         padding: "8px",
//         borderRight: "1px solid #e2e8f0",
//       }}
//     >
//       <Typography
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontWeight: "bold",
//           borderRadius: "4px",
//           color: "white",
//           backgroundColor: "#334B71",
//           padding: "20px",
//           width: "auto",
//           fontFamily: TITLE,
//           marginTop: 17,
//           boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.6)",
//           marginBottom: "50px",
//           //height: "100%",
//         }}
//       >
//         Code Blocks
//       </Typography>
//       {/* Motion */}
//       <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>
//         {" "}
//         {"Motion"}{" "}
//       </div>
//       <Droppable droppableId="sideArea-motion" type="COMPONENTS">
//         {(provided) => (
//           <ul
//             style={{ margin: "12px 0" }}
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {motion.map((x, i) => {
//               return (
//                 <Draggable
//                   key={`${x}-sideArea`}
//                   draggableId={`${x}-sideArea`}
//                   index={i}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       className="my-2"
//                     >
//                       {getComponent(x)}
//                     </li>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </ul>
//         )}
//       </Droppable>

//       {/* Looks */}
//       <div style={{ fontWeight: "bold", fontFamily: CONTENT }}> {"Looks"} </div>
//       <Droppable droppableId="sideArea-looks" type="COMPONENTS">
//         {(provided) => (
//           <ul
//             className="sideArea-looks my-3"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {looks.map((x, i) => {
//               return (
//                 <Draggable
//                   key={`${x}-sideArea`}
//                   draggableId={`${x}-sideArea`}
//                   index={i}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       className="my-2"
//                     >
//                       {getComponent(x)}
//                     </li>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </ul>
//         )}
//       </Droppable>

//       {/* Control */}
//       <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>
//         {" "}
//         {"Control"}{" "}
//       </div>
//       <Droppable droppableId="sideArea-control" type="COMPONENTS">
//         {(provided) => (
//           <ul
//             className="sideArea-control my-3"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {control.map((x, i) => {
//               return (
//                 <Draggable
//                   key={`${x}-sideArea`}
//                   draggableId={`${x}-sideArea`}
//                   index={i}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       className="my-2"
//                     >
//                       {getComponent(x)}
//                     </li>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </ul>
//         )}
//       </Droppable>

//       {/* Events */}
//       <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>
//         {" "}
//         {"Events"}{" "}
//       </div>
//       <Droppable droppableId="sideArea-events" type="COMPONENTS">
//         {(provided) => (
//           <ul
//             className="sideArea-events my-3"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {events.map((x, i) => {
//               return (
//                 <Draggable
//                   key={`${x}-sideArea`}
//                   draggableId={`${x}-sideArea`}
//                   index={i}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       className="my-2"
//                     >
//                       {getComponent(x)}
//                     </li>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </ul>
//         )}
//       </Droppable>
//     </div>
//   );
// }

export default function CodeBlocks() {
  // Droppable Area Component
  function DraggableArea({ droppableId, components }) {
    const [items, setItems] = useState(components);
    const [refreshKey, setRefreshKey] = useState(0);

    const [changed, setChanged] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setRefreshKey((prevKey) => prevKey + 1);
        setChanged(true);
      }, 500);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Droppable droppableId={droppableId} type="COMPONENTS">
        {(provided) => (
          <ul
            className={`${droppableId} my-3`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((x, i) => (
              <Draggable
                key={`${x}-sideArea-${refreshKey}`} // Append refreshKey to key to force re-render
                draggableId={`${x}-sideArea`}
                index={i}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="my-2"
                  >
                    {getComponent(x)}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  }

  return (
    <div
      style={{
        width: "270px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        padding: "8px",
      }}
    >
      <Typography
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          borderRadius: "4px",
          color: "white",
          backgroundColor: "#334B71",
          padding: "20px",
          width: "auto",
          fontFamily: TITLE,
          marginTop: 17,
          boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.6)",
          marginBottom: "50px",
        }}
      >
        Code Blocks
      </Typography>

      <div
        id="code-blocks-container"
        style={{
          width: "100%",
          flexShrink: 0,
          flex:1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>Motion</div>
        <DraggableArea
          droppableId="sideArea-motion"
          components={motionComponents}
        />

        <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>Looks</div>
        <DraggableArea
          droppableId="sideArea-looks"
          components={looksComponents}
        />

        <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>Control</div>
        <DraggableArea
          droppableId="sideArea-control"
          components={controlComponents}
        />

        <div style={{ fontWeight: "bold", fontFamily: CONTENT }}>Events</div>
        <DraggableArea
          droppableId="sideArea-events"
          components={eventsComponents}
        />
      </div>
    </div>
  );
}
