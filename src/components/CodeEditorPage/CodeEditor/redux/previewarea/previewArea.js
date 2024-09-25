import {
  SET_SHOW_AXES,
  SET_SHOW_COORDINATES,
  SET_SHOW_PROJECTIONS,
} from "./actionTypes";

const initialState = {
  showAxes: false,
  showCoordinates: false,
  showProjections: false,
};

export const previewAreaReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOW_AXES: 
    {
        return{
            ...state,
            showAxes: action.visible,
        }
    }

    case SET_SHOW_COORDINATES: 
    {
        return{
            ...state,
            showCoordinates: action.visible,
        }
    }

    case SET_SHOW_PROJECTIONS: 
    {
        return{
            ...state,
            showProjections: action.visible,
        }    
    }

    default:
        return state;
  }
};
