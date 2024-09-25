//function to get the default entry in the component array of a midAreaList according to the name of the component
export const getComponentElement = (key) => {
  switch (key) {
    case "MOVE_Y":
      return { id: key, values: [0], active: true };
    case "MOVE":
      return { id: key, values: [0], active: true };

    case "TURN_CLOCKWISE":
      return { id: key, values: [0], active: true };

    case "TURN_ANTI_CLOCKWISE":
      return { id: key, values: [0], active: true };

    case "GOTO_XY":
      return { id: key, values: [0, 0], active: true };

    case "SAY_MESSAGE":
      return { id: key, values: [""], active: true };

    case "SAY_MESSAGE_WITH_TIMER":
      return { id: key, values: ["", 0], active: true };

    case "SIZE":
      return { id: key, values: [1], active: true };

    case "SHOW":
      return { id: key, values: [], active: true };

    case "HIDE":
      return { id: key, values: [], active: true };

    case "BROADCAST":
      return { id: key, values: [""], active: true };

    case "WAIT":
      return { id: key, values: [0], active: true };

    case "REPEAT":
      return { id: key, values: [0, []], active: true };

    case "HIDE_MESSAGE":
      return { id: key, values: [], active: true };

    case "THINK":
      return { id: key, values: [""], active: true };

    case "THINK_TIMER":
      return { id: key, values: ["", 0], active: true };

    default:
      return null;
  }
};
