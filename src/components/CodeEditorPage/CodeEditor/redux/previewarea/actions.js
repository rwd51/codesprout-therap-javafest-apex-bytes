import { SET_SHOW_AXES, SET_SHOW_COORDINATES, SET_SHOW_PROJECTIONS } from "./actionTypes";

export const setShowAxes = (visible) => {
    return {
      type: SET_SHOW_AXES,
      visible: visible,
    };
};

export const setShowCoordinates = (visible) => {
    return {
      type: SET_SHOW_COORDINATES,
      visible: visible,
    };
};

export const setShowProjections = (visible) => {
    return {
      type: SET_SHOW_PROJECTIONS,
      visible: visible,
    };
};
